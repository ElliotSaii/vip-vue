<template>

<a-modal :visible="visible" :title="t('sub_product_list')" @cancel="closeModal()" @ok="handleFinish"  width="90%">
  <a-table :columns="columns" :data-source="data" :pagination="false">

    <template #headerCell="{column}">
      <span> {{t(column.slotName)}}</span>
    </template>

    <template #bodyCell="{ column ,record}">
      <!-- <template v-if="column.key === 'fromImgUrl'">
        <a-image width="25px" :src="record.fromImgUrl" />
      </template> -->
      <template v-if="column.key === 'description'">
       <p v-html="record.description"> </p>
      </template>
      <template v-if="column.key === 'imageUrl'">
        <a-image width="25px" :src="record.imageUrl" />
      </template>
      <template v-if="column.key === 'operation'">
        
      <a-popconfirm :title="t('sure')" :ok-text="t('yes_txt')" :cancel-text="t('no_txt')" @confirm="deleteSub(record.subId)" >
            <template #icon><question-circle-outlined style="color: red" /></template>
          <a-typography-text type="danger"> {{t('delete')}} </a-typography-text>
      </a-popconfirm>

      </template>
    </template>
  </a-table>
  <a-pagination v-model:current="current" v-model:pageSize="perPage" :total="totalSub" showLessItems :hideOnSinglePage="true" @change="subProductList()"/>
</a-modal>

</template>

<script setup>
import { DELETE_SUB, SUBPRODUCTLIST } from '@/plugins/api';
import { message } from 'ant-design-vue';
import { ref, onMounted} from 'vue';

const props = defineProps(['visible','subProductId']);// eslint-disable-line
const emit = defineEmits(['closeDialog']);// eslint-disable-line
const data = ref([]);

const current = ref(1);
const perPage = ref(10);
const totalSub = ref();

import { useI18n } from "vue-i18n";

 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });

const columns = [{
  slotName: 'number',
  scopedSlots: {customRender: 'number',title: 'number'},
  dataIndex: 'no',
  key: 'no',
  fixed: 'left',
}, {
  slotName: 'name',
  scopedSlots: {customRender: 'name',title: 'name'},
  dataIndex: 'subName',
  key: 'subName',
  fixed: 'left',
}, {
  slotName: 'description',
  scopedSlots: {customRender: 'description',title: 'description'},
  dataIndex: 'description',
  key: 'description',
}, {
  
  slotName: 'from_link',
  scopedSlots: {customRender: 'from_link',title: 'from_link'},
  dataIndex: 'fromImgUrl',
  key: 'fromImgUrl',
}, {
  slotName: 'image',
  scopedSlots: {customRender: 'image',title: 'image'},
  dataIndex: 'imageUrl',
  key: 'imageUrl',
}, {
  slotName: 'unit_price',
  scopedSlots: {customRender: 'unit_price',title: 'unit_price'},
  dataIndex: 'unitPrice',
  key: 'unitPrice',
}, {
  slotName: 'create_time',
  scopedSlots: {customRender: 'create_time',title: 'create_time'},
  dataIndex: 'createTime',
  key: 'createTime',

}, 
{
  slotName: 'operation',
  scopedSlots: {customRender: 'operation',title: 'operation'},
  key: 'operation',
  fixed: 'right',
  width: 100,
}];

async function subProductList(){
  const productId = props.subProductId;

  let res = await SUBPRODUCTLIST(productId,current.value,perPage.value)

  let list = res.obj.list;
  console.log(list);

  data.value = list.map((sub,index)=>{
    return {  

              no: index + 1,
              subId: sub.id,
              subName: sub.name,
              description: sub.description,
              fromImgUrl: sub.fromImgUrl,
              imageUrl: sub.imageUrl,
              unitPrice: sub.unitPrice,
              createTime: sub.createTime,
            }
  })
  totalSub.value = res.obj.totalElements;
}

 async function deleteSub(subId){
  let res = await DELETE_SUB(subId);
    
    if(res.code==200){
      message.success(t('success'),0.5);
       subProductList();
    }else if(res.code ==500){
      message.error(t('fail'),0.5);
    }
}

function closeModal(){
   emit('closeDialog');
}


async function handleFinish(){
    emit('closeDialog');
}

onMounted(()=>{
  subProductList()
 console.log("--"+props.subProductId);
})

</script>