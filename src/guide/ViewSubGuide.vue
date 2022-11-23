<template>
  <a-modal :title="t('sub_guide_list')" :visible="visible" @cancel="closeModal()"  @ok="handleFinish"  width="full" :cancel-text="t('cancel_txt')"
      :ok-text="t('ok_txt')">

  <a-table :columns="columns" :data-source="dataSource" :pagination="false">

     <template #headerCell="{column}">
        <span> {{t(column.slotName)}}
        </span>
     </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'imageUrl'">
        <a-image width="35px" :src="record.imageUrl" />
      </template>

      <template v-if="column.dataIndex === 'videoUrl'">
              
              <div v-show="record.videoUrl!==''">
                <video width="150" height="80" controls :style="{margin: '26px 0px 0px 0px'}" >
                <source :src="record.videoUrl" type="video/mp4" >
                </video>
              </div>
        
      </template>

   

      <template v-if="column.dataIndex === 'operation'">
          <a-popconfirm :title="t('sure')" :ok-text="t('yes_txt')" :cancel-text="t('no_txt')" @confirm="deleteSubGuide(record.id)" >
            <template #icon><question-circle-outlined style="color: red" /></template>
          <a-typography-text type="danger"> {{t('delete')}} </a-typography-text>
          </a-popconfirm>
           <a-divider  type="vertical"></a-divider>
          <a @click="editSubGuide(record)" > {{t('edit')}} </a>
      </template>
      <template v-if="column.dataIndex === 'description'">
          <p v-dompurify-html ="record.description"  />
      </template>
    </template>
  </a-table>
 <a-pagination  showLessItems :hideOnSinglePage="true" @change="getSubGuideList()"/>

</a-modal>
<EditSubGuide :visible="isVisible" v-if="isVisible" :subGuide="selectedSubGuide" @refresh="refreshPage()" @closeDialog="closeDialog()" />

</template>

<script setup>

import EditSubGuide from './EditSubGuide.vue'
import {ref, onMounted} from 'vue';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { DELETE_SUB_GUIDE, SUB_GUIDE_LIST } from '@/plugins/api';
import { message } from 'ant-design-vue';

const dataSource = ref([]);
const emit= defineEmits(['closeDialog'])// eslint-disable-line
const props = defineProps(['visible','guideId']);// eslint-disable-line

const isVisible = ref(false);
const selectedSubGuide = ref();

import {useI18n} from 'vue-i18n';
 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });


const columns= [
    {
        slotName: 'number',
        scopedSlots: {customRender: 'number', title: 'number'},
        dataIndex: 'no',
        key: 'no'
  
    },
    {
        slotName: 'title',
        scopedSlots: {customRender: 'title', title: 'title'},
        dataIndex: 'title',
        key: 'title'
  
    },
    {
        slotName: 'description',
        scopedSlots: {customRender: 'description', title: 'description'},
        dataIndex: 'description',
        key: 'description'
  
    },
    {
        slotName: 'video',
        scopedSlots: {customRender: 'video', title: 'video'},
        dataIndex: 'videoUrl',
        key: 'videoUrl'
  
    },
    {
        slotName: 'create_time',
        scopedSlots: {customRender: 'create_time', title: 'create_time'},
        dataIndex: 'createTime',
        key: 'createTime'
  
    },
    {
        slotName: 'operation',
        scopedSlots: {customRender: 'operation', title: 'operation'},
        dataIndex: 'operation'
    },
]


async function getSubGuideList(){ 
    const guideId =props.guideId;
    let res = await SUB_GUIDE_LIST(guideId);
    
    if(res.code==200){
        let list =res.obj.list;
           dataSource.value = list.map((subGuide,index)=>{

            return {
                no: index +1,
                id: subGuide.id,
                title: subGuide.title,
                description: subGuide.description,
                videoUrl: subGuide.videoUrl,
                createTime: subGuide.createTime
            }
           })
    }
}

function refreshPage(){
    getSubGuideList();
}

function closeDialog(){
    isVisible.value =false;
}

function editSubGuide(record){
    isVisible.value = true;
    selectedSubGuide.value=record;

}

async function closeModal(){
    emit('closeDialog')
}

async function handleFinish(){
    emit('closeDialog')
}

async function deleteSubGuide(id){
    let res =await DELETE_SUB_GUIDE(id);

    if(res.code==200){
        message.success(t('success'),0.5);

    }else {
        message.error(t('fail'),0.5);
    }
        getSubGuideList();
}

onMounted(()=>{
    getSubGuideList();
})

</script>