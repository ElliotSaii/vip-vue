

<template>
  <div>
    <div >
    <h1 >{{t('order_list')}} </h1>

    <a-form  layout="inline" >
    <a-form-item>
      <a-input-search v-model:value="searchName" v-debounce:1150ms.cancelonempty="onSearch" :debounce-events="['click', 'keyup']" :placeholder="t('search_name')" style="width: 200px" @search="onSearch" >
         <template #prefix><UserOutlined style="color: rgba(0, 0, 0, 0.25)" /></template>
      </a-input-search>
    </a-form-item>
      <a-form-item :style="{width: '200px'}">
        <Select ref="select" v-model:value="status"   @change="filterStatus">
        <Select.Option :value="0"> {{t('all')}} </Select.Option >
        <Select.Option :value="1">{{t('pending')}}</Select.Option >
        <Select.Option  :value="2"> {{t('success')}} </Select.Option >
        <Select.Option  :value="3"> {{t('fail')}} </Select.Option >
      </Select>
      
      </a-form-item>
     </a-form>
 
    </div>

    <a-table  :style="{margin:'5px'}" :columns="columns"  :data-source="dataSource"  class="components-table-demo-nested" :pagination="false" :scroll="{ y: 600 }" >

      <template #headerCell="{column}">
        <span> {{t(column.slotName)}} </span>
      </template>

      <template #bodyCell="{ column, record }" >
        <template v-if="column.key === 'operation'">
          <a @click="authStatus(record)" >
            
           <span style="text: 9px" v-if="record.buyStatus!==2 " > {{t('auth')}} </span>
          </a>
        </template>
        <template v-if="column.key === 'imageUrl'">
         <a-image width="25px"
          :src="record.imageUrl"
         >
       </a-image>
      </template>
     
     <template v-if="column.key==='buyStatus'">
            <span  v-if="record.buyStatus =='1'" :style="{color: '#2db7f5'}">{{$t('pending')}} </span>
          <span v-if="record.buyStatus =='2'"  :style="{color: ' #87d068'}">{{$t('success')}} </span>
           <span v-if="record.buyStatus =='3'" :style="{color: 'red'}"> {{t('fail')}} </span>
     </template>

    

      </template>
    </a-table>

    
   <a-pagination  v-model:current="current" :total="totalOrder" show-less-items @change="getOrderList()"   :hideOnSinglePage="true" v-model:pageSize="perPage" :pageSizeOptions="pageSizeOptions"/>
   <OrderModal :visible="visible" :order="selectedOrder" @refresh="refreshPage()" @closeDialog="closeDialog()" />
  </div>

</template>
<script setup>
import { FILTER_ORDER_STATUS, ORDERLIST, SEARCHORDER } from '@/plugins/api';
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue';
import { message,Select ,} from 'ant-design-vue';
import {  onMounted, reactive, ref ,watch} from 'vue';
import OrderModal from './OrderModal.vue'


import {useI18n} from 'vue-i18n';

const {t}= useI18n({
  inheritLocale: true,
  useScope: "local"
})
 


const pageSizeOptions = ref(['10','20','30','40','50'])

  const dataSource = ref([]);
    const editableData = reactive({});
    const perPage = ref(10);
    const current = ref(1);
    const totalOrder = ref(0);
    
    const visible = ref(false);
    const selectedOrder = ref(null);
    const searchName = ref('');

    const status  = ref(0);

   

const columns = [
// {
//   slotName: "number",
//   scopedSlots: {customRender: 'number', title: 'number'},
//   dataIndex: 'no',
//   key: 'no'
 
// },
{
  slotName: "memId",
  scopedSlots: {customRender: 'memId', title: 'memId'},
  dataIndex: 'memId',
  key: 'memId'
 
},
{
  slotName: "product_name",
  scopedSlots: {customRender: 'product_name', title: 'product_name'},
  dataIndex: 'productName',
  key: 'productName'
 
},
 {
  slotName: "amount",
  scopedSlots: {customRender: 'amount', title: 'amount'},
  dataIndex: 'buyAmount',
 key: 'buyAmount'
}, 
 {
  slotName: "image",
  scopedSlots: {customRender: 'image', title: 'image'},
  dataIndex: 'imageUrl',
 key: 'imageUrl'
}, 
 {
  slotName: "status",
  scopedSlots: {customRender: 'status', title: 'status'},
  dataIndex: 'buyStatus',
 key: 'buyStatus',
 },
 {
  slotName: "create_time",
   scopedSlots: {customRender: 'create_time', title: 'create_time'},
  dataIndex: 'createTime',
 key: 'createTime'
}, 
 {
  slotName: "type",
   scopedSlots: {customRender: 'type', title: 'type'},
  dataIndex: 'productType',
  key: 'productType',
 customRender: (text,record,index)=> text.text == 1  ? t('main_product') : t('sub_product')
//  customRender: (text,record,index) => JSON.stringify(text) + ''
}, 
 {
  slotName: "unit_price",
   scopedSlots: {customRender: 'unit_price', title: 'unit_price'},
  dataIndex: 'unitPrice',
 key: 'unitPrice'
}, 

{
  slotName: "total_unit_price",
   scopedSlots: {customRender: 'total_unit_price', title: 'total_unit_price'},
  dataIndex: 'totalUnitPrice',
  key: 'totalUnitPrice'
}, {
  slotName: "operation",
   scopedSlots: {customRender: 'operation', title: 'operation'},
  dataIndex: 'operation',
  key: "operation"
}];


const filterStatus= async(e)=>{
// debugger
searchName.value=''
 status.value = e;
 current.value = 1;
 getOrderList();
 
}

watch(searchName,(currentVal,oldVal)=>{
  if(currentVal===''){
    getOrderList()
  }
})
  
  const  onSearch= async (val)=>{
      current.value=1;
      
       getOrderList();
  }

  function closeDialog(){
    visible.value =false;
  }
   
   function authStatus(record){
    visible.value =!visible.value
     selectedOrder.value = record;
   }

   function refreshPage(){
    getOrderList();
 
   }
  const getOrderList = async ()=>{
      let res = await  ORDERLIST(perPage.value,current.value,status.value,searchName.value);

    if(res.code==500){
    dataSource.value = []
    totalOrder.value = 0;
  }


    let list = res.obj.list;

    dataSource.value = list.map((product, index) => {
    return {
      no: index + 1,
      memId: product.memberId,
      productName: product.name,
      buyAmount: product.buyAmount,
      buyStatus: product.buyStatus,
      productType: product.productType,
      totalUnitPrice: product.totalUnitPrice,
      createTime: product.createTime,
      imageUrl: product.imageUrl,
      id: product.id,
      unitPrice: product.unitPrice,
      memberId: product.memberId
    }
  })

      totalOrder.value = res.obj.totalElements;
}


    onMounted(()=>{
        getOrderList();
       
    })
</script>
<style scoped>
.editable-row-operations a {
  margin-right: 8px;
}
</style>