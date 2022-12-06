<template>
<a-space direction="vertical">
<h1> {{t('app_platform')}} </h1>

<a-button disabled  @click="releaseApp()"> <PlusOutlined /> {{t('add')}} </a-button>
 </a-space>


  <a-table :columns="columns" :data-source="dataSource" :pagination="false" :style="{margin :'6px 0'}">
  <template #headerCell="{column}">
    <span> {{t(column.slotName)}}</span>
   </template>

    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'description'">
           
      <p v-dompurify-html="record.description"></p>
      </template>


      <template v-if="column.dataIndex === 'operation'">
           
          <a @click="update(record)"> {{t('update')}} </a>
      </template>
    </template>
  </a-table>


<AppModal :visible="isVisible" v-if="isVisible" @refresh="refreshPage()" @closeDialog="closeDialog()" />

<UpdateModal :visible="isUpdateModalVisible" :platform="selectedPlatform"  v-if="isUpdateModalVisible" @refresh="refreshPage()" @closeDialog="closeDialog()" />
</template>

<script setup>
import UpdateModal from './UpdateModal.vue'
import AppModal from './AppModal.vue'
import { PlusOutlined ,QuestionCircleOutlined } from '@ant-design/icons-vue';
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import { message } from 'ant-design-vue';
import { APP_UPDATE, APP_VERSION } from '@/plugins/api';


const dataSource = ref([])

const isVisible = ref(false);
const isUpdateModalVisible = ref(false);
const selectedPlatform = ref('');

import {useI18n} from 'vue-i18n'

 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });


const columns = [{
  slotName: "number",
  scopedSlots: {customRender: 'number', title: 'number'},
  dataIndex: 'no',
  key: 'no',
}, {
  slotName: "platform",
  scopedSlots: {customRender: 'platform', title: 'platform'},
  dataIndex: 'platform',
  key: 'platform',
  customRender:(text,record,index)=> text.text=='1'? t('andriod') :  t('ios')

},
{
  slotName: "name",
  scopedSlots: {customRender: 'name', title: 'name'},
  dataIndex: 'name',
  key: 'name',

},  
{
  slotName: "create_time",
  scopedSlots: {customRender: 'create_time', title: 'create_time'},
  dataIndex: 'createTime',
  key: 'createTime',

},  
 
{
  slotName: "download_link",
  scopedSlots: {customRender: 'download_link', title: 'download_link'},
  dataIndex: 'link',
  key: 'link',
   ellipsis: true,

},  
{
  slotName: "version",
  scopedSlots: {customRender: 'version', title: 'version'},
  dataIndex: 'version',
  key: 'version',

},  
// {
//   title: 'Version Code',
//   dataIndex: 'versionCode',
//   key: 'versionCode',

// },  
{
  slotName: 'description',
  scopedSlots: {customRender: 'description', title: 'description'},
  dataIndex: 'description',
  key: 'description',
    ellipsis: true,

},  

{
  slotName: 'operation',
  scopedSlots: {customRender: 'operation', title: 'operation'},
  dataIndex: 'operation',
}];

function closeDialog(){
  isVisible.value =false;
  isUpdateModalVisible.value =false;
}

async function getAppList(){
  let res =await APP_VERSION();
  if(res.code==200){
    let link = res.obj;
    dataSource.value = link.map((app,index)=>{

      return {
        no: index+1,
        id: app.id,
        name: app.name,
        description: app.description,
        platform: app.platform,
        version: app.version,
        createTime: app.createTime,
        link: app.link,

      }
    })
  } else {
    dataSource.value =[]
  }
}

  async function update(record){
    
    isUpdateModalVisible.value = true;
    selectedPlatform.value =record;
   
  
  }

async function   refreshPage(){
  getAppList();
}

async function releaseApp(){
  isVisible.value = true;
}

onMounted(()=>{
  getAppList();
})

</script>