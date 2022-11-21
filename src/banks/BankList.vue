<template>
<a-space direction="vertical">
<h1> {{t('bank_list')}} </h1>
 <a-button @click="addBank()" > <PlusOutlined /> <span style="text: 9px"> {{t('add')}} </span> </a-button> 
</a-space>
  
  

  <a-table :columns="columns" :data-source="dataSource" :pagination="false">

   <template #headerCell="{column}">
    <span> {{t(column.slotName)}}</span>
   </template>

    <template #bodyCell="{ column, record }">
      
      <template v-if="column.key==='banKVersion'">
          <span v-if="record.banKVersion =='2'"  :style="{color: ' #87d068'}">{{$t('bank_available')}} </span>
           <span v-if="record.banKVersion =='3'" :style="{color: 'red'}"> {{t('bank_not_available')}} </span>
      </template>
      <template v-if="column.key==='operation'">
         <a @click="editBank(record)"> {{$t('edit')}} </a>
      </template>
      
    </template>
  </a-table>
 <a-pagination  showLessItems :hideOnSinglePage="true" @change="getBankList()"/>
<AddBankModal :visible="isVisible" @refresh="refreshPage()" @closeDialog="closeDialog()" />
<EditBankModal :visible="isEditFormVisible" :bank="selectedBank" v-if="isEditFormVisible" @refresh="refreshPage()" @closeDialog="closeDialog()"  />

</template>

<script setup>
import EditBankModal from './EditBankModal.vue'
import AddBankModal from './AddBankModal.vue'
import { BANK_LIST } from '@/plugins/api';
import { PlusOutlined ,QuestionCircleOutlined } from '@ant-design/icons-vue';
import { ref } from '@vue/reactivity';
import { onMounted } from '@vue/runtime-core';
import {useI18n} from 'vue-i18n'

const isVisible = ref(false)
const isEditFormVisible=ref(false)
const selectedBank = ref({});
const dataSource = ref([])


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
  slotName: "name",
  scopedSlots : {customRender: 'name', title: 'name'},
  dataIndex: 'name',
  key: 'name',

}, 
{
  slotName: "bank_acc_name",
  scopedSlots : {customRender: 'bank_acc_name', title: 'bank_acc_name'},
  dataIndex: 'accountName',
  key: 'accountName',
  ellipsis: true,
},
{
  slotName: "bank_branch_name",
  scopedSlots : {customRender: 'bank_branch_name', title: 'bank_branch_name'},
  dataIndex: 'branchName',
  key: 'branchName',
  ellipsis: true,
},

{
  slotName: "create_time",
  scopedSlots : {customRender: 'create_time', title: 'create_time'},
  dataIndex: 'createTime',
  key: 'createTime',
  ellipsis: true,
},
 {
  slotName: "bank_acc_number",
  scopedSlots : {customRender: 'bank_acc_number', title: 'bank_acc_number'},
  dataIndex: 'accountNo',
  key: 'accountNo',
  ellipsis: true,
}, 
 {
  slotName: "bank_version",
  scopedSlots : {customRender: 'bank_version', title: 'bank_version'},
  dataIndex: 'banKVersion',
  key: 'banKVersion',
  ellipsis: true,
}, 
{
 slotName: "operation",
  scopedSlots : {customRender: 'title', title: 'title'},
  dataIndex: 'operation',
  key :  "operation"
}
];

function editBank(record){
isEditFormVisible.value=true;
selectedBank.value = record;

}


function addBank(){
    isVisible.value =true;
}

async function getBankList(){
     let res=await BANK_LIST();

     if(res.code ==200){
        let list = res.obj;
        dataSource.value = list.map((bank,index)=>{
          return{
           no: index+1,
           name: bank.name,
           id: bank.id,
           accountName: bank.accountName,
           accountNo: bank.accountNo,
           banKVersion: bank.banKVersion,
           createTime: bank.createTime,
           branchName: bank.branchName
          }
        })

     }

}

function refreshPage(){
    getBankList();

}

function closeDialog(){
    isVisible.value =false;
    isEditFormVisible.value =false
}

onMounted(()=>{
    getBankList();
})

</script>