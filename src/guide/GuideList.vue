<template>
<a-space direction="vertical">
<h1> {{t('guide_list')}} </h1>
 <a-button @click="addGuide()" > <PlusOutlined /> <span style="text: 9px"> {{t('add')}} </span> </a-button> 
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
           
           <a @click="addSubGuide(record)" > <PlusOutlined /> <span style="text: 9px"> {{t('add')}} </span> </a>
           <a-divider  type="vertical"></a-divider>
          <a-popconfirm :title="t('sure')" :ok-text="t('yes_txt')" :cancel-text="t('no_txt')" @confirm="delteGuide(record.id)" >
            <template #icon><question-circle-outlined style="color: red" /></template>
          <a-typography-text type="danger"> {{t('delete')}} </a-typography-text>
          </a-popconfirm>
           <a-divider  type="vertical"></a-divider>
           <a @click="viewSubGuide(record.id)"> {{t('view')}} </a>
      </template>
    </template>
  </a-table>
 <a-pagination v-model:current="current" v-model:pageSize="perPage" :total="totalGuide" showLessItems :hideOnSinglePage="true" @change="getGuideList()"/>

  <GuideModal :visible="isVisible" v-if="isVisible"  @refresh="refreshPage()" @closeDialog="closeDialog()" />

  <SubGuideModal :visible="isSubVisible" v-if="isSubVisible" :guide="selectedGuide"  @refresh="refreshPage()" @closeDialog="closeDialog()" />

 <ViewSubGuide :visible="viewSubVisible" v-if="viewSubVisible" :guideId="selectedGuideId" @closeDialog="closeDialog()"  />
</template>

<script setup>
import ViewSubGuide from './ViewSubGuide.vue'
import GuideModal from './GuideModal.vue'
import SubGuideModal from './SubGuideModal.vue'
import { PlusOutlined ,QuestionCircleOutlined } from '@ant-design/icons-vue';
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import {  DELETE_GUIDE, GUIDE_LIST } from '@/plugins/api';
import { message } from 'ant-design-vue';

const viewSubVisible = ref(false);
const isVisible = ref(false)
const isSubVisible = ref(false)
const dataSource = ref([])

let selectedGuide = ref('')
let selectedGuideId = ref('')

const current =ref(1);
const perPage = ref(10);
let totalGuide = ref(0)

import {useI18n} from 'vue-i18n';
 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });


const columns = [{
    slotName: 'number',
    scopedSlots: {customRender: 'number', title: 'number'},
  dataIndex: 'no',
  key: 'no',
   customRender: (text,record,index)=>{
       
   }
},

{
  slotName: 'title',
  scopedSlots: {customRender: 'title', title: 'title'},
  dataIndex: 'title',
  key: 'title',

},
{
  slotName: 'create_time',
  scopedSlots: {customRender: 'create_time', title: 'create_time'},
  dataIndex: 'createTime',
  key: 'createTime',

},  {
  slotName: 'operation',
  scopedSlots: {customRender: 'operation', title: 'operation'},
  dataIndex: 'operation',
}];


function viewSubGuide(id){
    viewSubVisible.value =true;
    selectedGuideId.value = id

}

function addGuide(){
    isVisible.value =true;
}

function addSubGuide(record){
    isSubVisible.value =true;
    selectedGuide.value = record;
    console.log(record);
}

async function getGuideList(){
     let res=await GUIDE_LIST(current.value,perPage.value);

     if(res.code ==200){
        let list = res.obj.list
        dataSource.value = list.map((guide,index)=>{
          return{
           no: index+1,
           id: guide.id,
           title:  guide.title,
           createTime: guide.createTime
          }
        })

        totalGuide.value = res.obj.totalElements
     
     }

}

async function delteGuide(id){
  let res = await  DELETE_GUIDE(id);
  if(res.code==200){
    message.success(t('success'),0.5);
    refreshPage();
  }else {
    message.error(t('fail'),0.5);
  }
}

function refreshPage(){
    getGuideList();

}

function closeDialog(){
    isVisible.value =false;
    isSubVisible.value =false;
    viewSubVisible.value=false;
}

onMounted(()=>{
    getGuideList();
})

</script>