<template>
<div>
    <h1 > {{t('withdraw_list')}} </h1>
    <div id="withdraw" >
          <a-space>
            <a-button @click="setFee()" > <PlusOutlined /> <span style="text: 9px"> {{t('transaction_fee')}} </span> </a-button> 
            <AddFee v-if="isVisible"  :visible="isVisible"   @closeDialog="closeDialog()" @refresh="refreshPage()"/>
            <!-- <a-input-search v-model:value="value" placeholder="search name" style="width: 200px" @search="onSearch" /> -->
          </a-space>

    </div>

  <a-table :style="{margin:'5px 0'}"  :columns="columns"  :data-source="data"  class="components-table-demo-nested"  :pagination="false">


    <template #headerCell="{column}">
      <span> {{t(column.slotName)}} </span>
    </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'operation'">
            <template v-if="column.key === 'operation'">
          <a @click="authStatus(record)" >
            
           <span style="text: 9px"> {{t('auth')}} </span>
          </a>
        </template>
        </template>
        
      </template>




  </a-table>
  <a-pagination v-model:current="current" v-model:pageSize="perPage" :total="totalWithdraw" show-less-items @change="getWithdrawList()" :hideOnSinglePage="true" :pageSizeOptions="pageSizeOptions" />
    <Withdraw v-if="isAuthVisible" :visible="isAuthVisible" :withdraw="selectedWithdraw" @closeDialog="closeDialog()" @refresh="refreshPage()"/>
</div>

</template>

<script setup>

import {  PRODUCT_LIST, WITHDRAWLIST,  } from "@/plugins/api";
import { onMounted, ref, watch} from "vue";
import { PlusOutlined ,QuestionCircleOutlined } from '@ant-design/icons-vue';
import { message } from "ant-design-vue";

import AddFee from './FeeTransfer.vue'
import Withdraw from './WithdrawAuth.vue'

const pageSizeOptions = ref(['10','20','30','40','50'])
const data = ref([]);
const current = ref(1);

const perPage = ref(10);
const isVisible = ref(false);
const totalWithdraw = ref(0);
const selectedWithdraw = ref(null);
const value = ref('');
const isAuthVisible = ref(false)

import {useI18n} from 'vue-i18n';
const {t}= useI18n({
  inheritLocale:true,
  useScope: "local"
})


const columns = ref([
  {
    slotName: "memId",
    scopedSlots: {customRender: 'memId', title: 'memId'},
    dataIndex: "memId",
    key: 'memId'
  },
  // {
  //   slotName: "number",
  //   scopedSlots: {customRender: 'number', title: 'number'},
  //   dataIndex: "no",
  //   key: 'no'
  // },
  {
    slotName: "type",
    scopedSlots: {customRender: 'type', title: 'type'},
    dataIndex: "type",
    key: 'type',
   customRender: (text,record,index)=> text.text == 1  ? t('alipay') : t('bank')
  //  customRender: (text,record,index) => JSON.stringify(text) + ''
  },
  {
    slotName: "ali_name",
    scopedSlots: {customRender: 'ali_name', title: 'ali_name'},
    dataIndex: "alipayAccName",
    key: 'alipayAccName'
  },
  {
    slotName: "ali_number",
    scopedSlots: {customRender: 'ali_number', title: 'ali_number'},
    dataIndex: "alipayAccNo",
     key: 'alipayAccNo'
  },
  {
    slotName: "create_time",
    scopedSlots: {customRender: 'create_time', title: 'create_time'},
    dataIndex: "createTime",
     key: 'createTime'
  },
  {
    slotName: "amount",
    scopedSlots: {customRender: 'amount', title: 'amount'},
    dataIndex: "amount",
    key: 'amount'
  },
  {
    slotName: "real_amount",
    scopedSlots: {customRender: 'real_amount', title: 'real_amount'},
    dataIndex: "actualAmount",
    key: 'actualAmount'
  },
  {
    slotName: "bank_acc_name",
    scopedSlots: {customRender: 'bank_acc_name', title: 'bank_acc_name'},
    dataIndex: "bankAccName",
    key: 'bankAccName'
  },
  {
    slotName: "bank_acc_number",
    scopedSlots: {customRender: 'bank_acc_number', title: 'bank_acc_number'},
    dataIndex: "bankAccNo",
    key: 'bankAccNo'
  },
  {
    slotName: "bank_branch_name",
    scopedSlots: {customRender: 'bank_branch_name', title: 'bank_branch_name'},
    dataIndex: "bankBranchName",
    key: 'bankAccNo'
  },
  {
    slotName: "bank_name",
    scopedSlots: {customRender: 'bank_name', title: 'bank_name'},
    dataIndex: "bankName",
    key: 'bankName'
  },
  {
    slotName: "operation",
    scopedSlots: {customRender: 'operation', title: 'operation'},

    key: "operation",
  },
]);



function setFee(){
  isVisible.value = true;
}


function authStatus(record){
  isAuthVisible.value = !isAuthVisible.value;
 selectedWithdraw.value = record;
}


const onSearch= async (name)=>{
    
}

async function getWithdrawList() {
  var res = await WITHDRAWLIST(perPage.value,current.value)
  
  if(res.code==500){
    data.value = []
  }

  var list = res.obj.list;

  data.value = list.map((withdraw, index) => {
    return {
      no: index + 1,
      id: withdraw.id,
      alipayAccName: withdraw.alipayAccName,
      alipayAccNo: withdraw.alipayAccNo,
      createTime: withdraw.createTime,
      bankAccName: withdraw.bankAccName,
      amount: withdraw.amount,
      actualAmount: withdraw.actualAmount,
      bankAccNo: withdraw.bankAccNo,
      bankName: withdraw.bankName,
      bankBranchName: withdraw.bankBranchName,
      status: withdraw.status,
      type: withdraw.type
    }
  })
  totalWithdraw.value = res.obj.totalElements;
}

const refreshPage= ()=>{
  // if(totalProduct.value/perPage.value==0){
  getWithdrawList();

}


function closeDialog() {
 isVisible.value= false;
 isAuthVisible.value = false;
}



onMounted(()=> {
 getWithdrawList();
 
})

</script>