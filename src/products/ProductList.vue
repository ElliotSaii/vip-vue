<template>
<div>
    <h1 >{{$t('product_list')}}</h1>
    <div id="main-product" >
          <a-space>
            <a-button @click="addMainProduct()" > <PlusOutlined /> <span style="text: 9px"> {{$t('add')}} </span> </a-button> 
            <AddProduct v-if="isMainVisible"  :visible="isMainVisible"   @closeDialog="closeDialog()" @refresh="refreshPage()"/>
            <a-input-search v-model:value="searchName" v-debounce:1150ms.cancelonempty="onSearch" :debounce-events="['click', 'keyup']" :placeholder="t('search_name')" style="width: 200px" @search="onSearch" />
          </a-space>

    </div>

  <a-table :style="{margin:'5px 0'}"  :columns="columns"  :data-source="data"  class="components-table-demo-nested"  :pagination="false">


      <template #headerCell="{column}">
        <span> {{t(column.slotName)}}</span>
      </template>

      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation1'">
          <a-popconfirm :title="t('sure')" :ok-text="t('yes_txt')" :cancel-text="t('no_txt')" @confirm="deleteProduct(record.productId)" >
            <template #icon><question-circle-outlined style="color: red" /></template>
          <a-typography-text type="danger"> {{$t('delete')}} </a-typography-text>
          </a-popconfirm>
          <a-divider type="vertical"></a-divider>
          <a @click="editProduct(record)"> {{$t('edit')}} </a>
        </template>

        <template v-if="column.key === 'operation2'">
          <a @click="addProduct(record)" > <PlusOutlined /> <span style="text: 9px"> {{$t('add')}} </span> </a>
          <a-divider  type="vertical"></a-divider>
          <a @click="viewSub(record.productId)"> {{$t('view')}} </a>
        </template>
      </template>


    

  </a-table>
  <a-pagination  v-model:current="current" v-model:pageSize="perPage" :total="totalProduct" show-less-items @change="getProducts()" :hideOnSinglePage="true" :pageSizeOptions="pageSizeOptions" />
    <ViewSub v-if="isSubVisible" :subProductId="selectedProductId" :visible="isSubVisible" @closeDialog="closeDialog()" />
    <AddSubProduct v-if="isVisible" :visible="isVisible" :product="selectedProduct" @closeDialog="closeDialog()" @refresh="refreshPage(record)"/>
    <EditProductModal :visible="isEditVisible" :product="selectedProduct" v-if="isEditVisible" @refresh="refreshPage()" @closeDialog="closeDialog()" />
</div>

</template>

<script setup>
import EditProductModal from './EditProductModal.vue'
import { DELETEPRODUCT, PRODUCT_LIST, SEARCHPRODUCT } from "@/plugins/api";
import { onMounted, ref, watch} from "vue";

import AddSubProduct from './AddSubProduct.vue'
import { PlusOutlined ,QuestionCircleOutlined } from '@ant-design/icons-vue';
import AddProduct from './AddProduct.vue';
import { message } from "ant-design-vue";
import ViewSub from './ViewSubList.vue'

const pageSizeOptions = ref(['10','20','30','40','50'])

const isEditVisible = ref(false);
const innerData =ref([]);

const data = ref([]);
const current = ref(1);
const totalProduct = ref(0);
const perPage = ref(10);
const isVisible = ref(false);
const isMainVisible= ref(false);
const selectedProduct = ref(null);
const searchName = ref('');
let isSubVisible = ref(false)
const selectedProductId= ref(null);

import { useI18n } from "vue-i18n";
 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });

watch(searchName,(currentVal,oldVal)=>{
  if(currentVal===''){
    getProducts()
  }
})

const columns = ref([
  {
    slotName: "number",
    scopedSlots: {customRender: 'number', title : 'number'},
    dataIndex: "no",
    key: 'no'
  },
  {
    slotName: "product_name",
    scopedSlots: {customRender: 'product_name', title : 'product_name'},
    dataIndex: "name",
    key: 'name'
  },
  {
    slotName: "amount",
    scopedSlots: {customRender: 'amount', title : 'amount'},
    dataIndex: "buyAmount",
     key: 'buyAmount'
  },
  {
    slotName: "create_time",
    scopedSlots: {customRender: 'create_time', title : 'create_time'},
    dataIndex: "createTime",
     key: 'createTime'
  },
  {
    slotName: "total_unit_price",
    scopedSlots: {customRender: 'total_unit_price', title : 'total_unit_price'},
    dataIndex: "totalUnitPrice",
    key: 'totalUnitPrice'
  },
  {
    slotName: "operation1",
    scopedSlots: {customRender: 'operation1', title : 'operation1'},
    key: "operation1",
  },
  {
    slotName: "operation2",
    scopedSlots: {customRender: 'operation2', title : 'operation2'},
    key: "operation2",
  },
]);


async function editProduct(record){
  isEditVisible.value =true;
  selectedProduct.value  =record;
  console.log(selectedProduct.value);
}


async function viewSub(productId){
isSubVisible.value =!isSubVisible.value;
     selectedProductId.value = productId;
}



const onSearch= async (name)=>{
        if(name!==''){
          current.value=1;
          getProducts()
        }
      

}

async function getProducts() {
  var res = await PRODUCT_LIST(perPage.value, current.value,searchName.value);
   if(res.code ==500){
    data.value =[];
    totalProduct.value=0;
   }
  var list = res.obj.list;

  data.value = list.map((product, index) => {
    return {
      no: index + 1,
      productId: product.id,
      startTime: product.startTime,
      endTime: product.endTime,
      name: product.name,
      free: product.free,
      buyAmount: product.buyAmount,
      createTime: product.createTime,
      totalUnitPrice: product.totalUnitPrice
    }
  })
  totalProduct.value = res.obj.totalElement;
}

const refreshPage= ()=>{
  // if(totalProduct.value/perPage.value==0){
   current.value=1;
  
  getProducts();
}


async function deleteProduct(productId){
  let response = await DELETEPRODUCT(productId).then((res)=>{
     if(res.code==200){
    message.success("Deleted success!",0.4);
    refreshPage();
   }
   }).catch((err)=>{
    if(err.response.status==500){
      message.error("Server error",0.6)
    }
   })
  //  console.log(productId);
}



function addProduct(record) {
  isVisible.value = !isVisible.value;
  selectedProduct.value = record;
}

function closeDialog() {
  isMainVisible.value=false;
  isVisible.value = false;
  isSubVisible.value =false;
  isEditVisible.value =false;
}

function addMainProduct(){
  isMainVisible.value=!isMainVisible.value

}

onMounted(()=> {
  getProducts();
 
})

</script>