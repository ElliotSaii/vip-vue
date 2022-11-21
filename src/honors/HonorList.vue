<template>
<a-space direction="vertical">
<h1> {{t('honor_list')}} </h1>
 <a-button @click="addHonor()" > <PlusOutlined /> <span style="text: 9px"> {{t('add')}} </span> </a-button> 
</a-space>
  
  

  <a-table :columns="columns" :data-source="dataSource" :pagination="false">

   <template #headerCell="{column}">
    <span> {{t(column.slotName)}}</span>
   </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'imageUrl'">
        <a-image width="35px" :src="record.imageUrl" />
      </template>
    </template>
  </a-table>
 <a-pagination v-model:current="current" v-model:pageSize="perPage" :total="totalHonor" showLessItems :hideOnSinglePage="true" @change="getHonorList()"/>

  <HonorModal :visible="isVisible" @refresh="refreshPage()" @closeDialog="closeDialog()" />
</template>

<script setup>
import HonorModal from './HonorModal.vue'
import { PlusOutlined ,QuestionCircleOutlined } from '@ant-design/icons-vue';
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { HONOR_LIST } from '@/plugins/api';
import {useI18n} from 'vue-i18n'

const isVisible = ref(false)
const dataSource = ref([])

const current =ref(1);
const perPage = ref(10);
let totalHonor = ref(0)


const {t}= useI18n({
  inheritLocale: true,
  useScope: 'local'
})

const columns = [{
  slotName: "number",
  scopedSlots : {customRender: 'number', title: 'number'},
  dataIndex: 'no',
  key: 'no',
}, {
  slotName: "email",
  scopedSlots : {customRender: 'email', title: 'email'},
  dataIndex: 'email',
  key: 'email',

}, {
  slotName: "description",
  scopedSlots : {customRender: 'description', title: 'description'},
  dataIndex: 'description',
  key: 'description',
  ellipsis: true,
}, {
  slotName: "create_time",
  scopedSlots : {customRender: 'create_time', title: 'create_time'},
  dataIndex: 'createTime',
  key: 'createTime',
  ellipsis: true,
}, {
  slotName: "image",
  scopedSlots : {customRender: 'image', title: 'image'},
  dataIndex: 'imageUrl',
  key: 'imageUrl',
  ellipsis: true,
}, 
// {
//   title: 'Operation',
//   dataIndex: 'operation',
// }
];


function addHonor(){
    isVisible.value =true;
}

async function getHonorList(){
     let res=await HONOR_LIST(current.value,perPage.value);

     if(res.code ==200){
        let list = res.obj.list;

        dataSource.value = list.map((honor,index)=>{
          return{
           no: index+1,
           email: honor.email,
           description: honor.description,
           imageUrl: honor.imageUrl,
           createTime: honor.createTime
          }
        })
        totalHonor.value = res.obj.totalElements;
     }

}

function refreshPage(){
    getHonorList();

}

function closeDialog(){
    isVisible.value =!isVisible.value;
}

onMounted(()=>{
    getHonorList();
})

</script>