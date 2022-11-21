<template>
<a-space direction="vertical">
<h1>{{t('banner_list')}} </h1>
 <a-button @click="addBanner()" > <PlusOutlined /> <span style="text: 9px"> {{t('add')}} </span> </a-button> 
</a-space>

  <a-table :columns="columns" :data-source="dataSource" :pagination="false">
   
   
   <template #headerCell="{column}">
    <span> {{t(column.slotName)}}</span>
   </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'imageUrl'">
        <a-image width="35px" :src="record.imageUrl" />
      </template>

      <template v-if="column.dataIndex === 'operation'">
          <a-popconfirm :title="t('sure')" :ok-text="t('yes_txt')" :cancel-text="t('no_txt')" @confirm="deleteBanner(record.id)" >
            <template #icon><question-circle-outlined style="color: red" /></template>
          <a-typography-text type="danger"> {{t('delete')}} </a-typography-text>
          </a-popconfirm>
      </template>
    </template>
  </a-table>
 <a-pagination v-model:current="current" v-model:pageSize="perPage" :total="totalHonor" showLessItems :hideOnSinglePage="true" @change="getBannerList()"/>

  <BannerModal :visible="isVisible"  v-if="isVisible" @refresh="refreshPage()" @closeDialog="closeDialog()" />
</template>

<script setup>

import BannerModal from './BannerModal.vue'
import { PlusOutlined ,QuestionCircleOutlined } from '@ant-design/icons-vue';
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { BANNER_LIST, DELETE_BANNER, HONOR_LIST } from '@/plugins/api';
import { message } from 'ant-design-vue';

const isVisible = ref(false)
const dataSource = ref([])

const current =ref(1);
const perPage = ref(10);
let totalHonor = ref(0)

import { useI18n } from "vue-i18n";

 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });


const columns = [{
  slotName: "number",
  scopedSlots: {customRender: 'number',title: 'number'},
  dataIndex: 'no',
  key: 'no',
}, {
  slotName: "image",
  scopedSlots: {customRender: 'image',title: 'image'},
  dataIndex: 'imageUrl',
  key: 'imageUrl',

},
{
  slotName: "create_time",
  scopedSlots: {customRender: 'create_time',title: 'create_time'},
  dataIndex: 'createTime',
  key: 'createTime',

},  {
  slotName: "operation",
  scopedSlots: {customRender: 'operation',title: 'operation'},
  dataIndex: 'operation',
}];


function addBanner(){
    isVisible.value =true;
}

async function getBannerList(){
     let res=await BANNER_LIST();

     if(res.code ==200){
        let list = res.obj
        dataSource.value = list.map((banner,index)=>{
          return{
           no: index+1,
           id: banner.id,
           imageUrl:  banner.imageUrl,
           createTime: banner.createTime
          }
        })
     
     }

}

async function deleteBanner(id){
  let res = await  DELETE_BANNER(id);
  if(res.code==200){
    message.success(t('success'),0.5);
    refreshPage();
  }else {
    message.error(t('fail'),0.5);
  }
}

function refreshPage(){
    getBannerList();

}

function closeDialog(){
    isVisible.value =!isVisible.value;
}

onMounted(()=>{
    getBannerList();
})

</script>