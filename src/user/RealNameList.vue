<template>
<div>
    <h1 > {{ $t("realname_list") }} </h1>
 


    <a-table :columns="columns" :data-source="data" class="components-table-demo-nested" :pagination="false"
     
     
      
    > 

  <template #headerCell="{ column }">
  
      
         <span > {{$t(column.slotName)}} </span>
       
 
    </template> 


       
      <template #bodyCell="{ column, record }">

        <template v-if="column.key === 'front'"   >
          <a-image width="25px"
          :src="record.front"
          >
          </a-image>
        </template>
        <template v-if="column.key === 'back'">

          <a-image width="25px"
          :src="record.back"
          >
          </a-image>
        </template>
        <template v-if="column.key === 'face'">
          <a-image width="25px"
          :src="record.face"
          >
          </a-image>
        </template>
        <template v-if="column.key === 'headIcon'">
          <a-image width="25px"
          :src="record.headIcon"
          >
          </a-image>
        </template>

        <template v-if="column.key === 'operation'">
          <a @click="addRealName(record)" >
            
            <span style="text: 9px"> {{t("auth")}} </span>
          </a>
          <!-- <a-divider  type="vertical"></a-divider>
          <a>details</a> -->
        </template>

      </template>
    </a-table>
    <a-pagination v-model:current="current" :total="totalMember" show-less-items @change="getRealNameRequest()"/>
      
      <RealNameModal 
      v-if="isVisible" 
      :visible="isVisible" 
      :realname="selectedRealName" 
      @closeDialog="closeDialog()"
      @refresh="refreshPage()"
      />

  </div>

</template>

<script setup>
import { onMounted, ref, watch} from "vue";
import { PlusOutlined, } from '@ant-design/icons-vue';
import { REALNAMEREQUEST } from "@/plugins/api";
import RealNameModal from './RealNameModal.vue'
import { useRouter } from "vue-router";

import { useI18n } from "vue-i18n";

 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });



const columns = ref([

  {
   
    slotName: 'number',
    width: 120,
    dataIndex: "no",
    key: 'no',
    scopedSlots: {customRender: 'number', title: 'number'}
   
  },
  {

    slotName: 'username',
    dataIndex: "username",
    key: 'username',
    scopedSlots: {customRender: 'username', title: 'username'}


  },
  {
    slotName: "email",
    dataIndex: "email",
     key: 'email',
    scopedSlots: {customRender: 'email', title: 'email'}
  },
  {
    slotName: "status",
    dataIndex: "realNameStatus",
    key: 'realNameStatus',
    scopedSlots: {customRender: 'status', title: 'status'}
  },
    {
      slotName: "card_no",
      dataIndex: "cardNumber",
       key: 'cardNumber',
       scopedSlots: {customRender: 'card_no', title: 'card_no'}
    },
    {
      slotName: "front",
      dataIndex: "front",
       key: 'front',
       scopedSlots: {customRender: 'front', title: 'front'}
    },
    {
      slotName: "back",
      dataIndex: "back",
       key: 'back',
       scopedSlots: {customRender: 'back', title: 'back'}
    },
    {
      slotName: "face",
      dataIndex: "face",
      key: "face",
      scopedSlots: {customRender: 'face', title: 'face'}
    },
    {
      slotName: "head_icon",
      dataIndex: "headIcon",
      key: 'headIcon',
      scopedSlots: {customRender: 'head_icon', title: 'head_icon'}
    },
  {
    slotName: "operation",
    key: "operation",
    scopedSlots: {customRender: 'operation', title: 'operation'}
  },
]);

const data = ref([]);
const current = ref(1);
const totalMember = ref(0);
const perPage = ref(10);
const isVisible = ref(false);
const selectedRealName = ref(null);

async function getRealNameRequest() {
  var res = await REALNAMEREQUEST(perPage.value,current.value);
   if(res.code ==500){
    data.value =[];
   }
  var list = res.obj.list;

  data.value = list.map((mem, index) => {
    return {
      no: index + 1,
      memberId: mem.id,
      username: mem.username,
      cardNumber: mem.cardNumber,
      email: mem.email,
      front: mem.front,
      back: mem.back,
      face: mem.face,
      headIcon: mem.headIcon,
      realNameStatus: mem.realNameStatus,
      cynBalance: mem.cynBalance
    }
  })
  totalMember.value = res.obj.totalElements;
}

const refreshPage= ()=>{
  // if(totalProduct.value/perPage.value==0){
   current.value=1;
  
  getRealNameRequest();
}





function closeDialog() {
  isVisible.value = false;
}
const addRealName =(record) =>{
  isVisible.value = !isVisible.value
  selectedRealName.value = record
}



onMounted(()=> {
  
 
  getRealNameRequest();

  
})

</script>