<template>
  <div>
    <h1 > {{$t("member_list")}} </h1>
   <div id="user-list" >
     <a-input-search v-model:value="value" :placeholder="t('search_name')" :style="{width: '200px', margin: '10px 0'}" @search="onSearch" />
   </div>
    <a-table
      :columns="columns"
      :data-source="dataSource"
      class="components-table-demo-nested"
      :pagination="false"
    >
      <template #headerCell=" {column}">
       <span> {{$t(column.slotName)}} </span>
      </template>

      <template #bodyCell="{ column, record }">
        <!-- <template v-if="column.key === 'front'">
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
        </template> -->
        <template v-if="column.key === 'face'">
          <a-image width="25px"
          :src="record.face"
          >
          </a-image>
        </template>
        <template v-if="column.key === 'realNameStatus'">
         
           <span  v-if="record.realNameStatus =='0'" :style="{color: 'yellow'}">{{$t('new_user')}} </span>
          <span v-if="record.realNameStatus =='1'"  :style="{color: '#2db7f5'}"> {{$t('pending')}} </span>
           <span v-if="record.realNameStatus =='2'" :style="{color: '#87d068'}"> {{$t('success')}} </span>
         
        </template>

        <!-- <template v-if="column.key === 'operation'">

          <a  @click="editUser(record)">
            <span style="text: 9px">edit</span>
          </a>
        </template> -->

      </template>
    </a-table>
    <a-pagination v-model:current="current" v-model:pageSize="perPage" :total="totalMember" :hideOnSinglePage="true" show-less-items @change="getMemberList()"/>
    

  </div>

</template>

<script setup>

import {  MEMBER_LIST, PRODUCT_LIST, SEARCH_MEMBER, WITHDRAWLIST,  } from "@/plugins/api";
import { onMounted, ref, watch} from "vue";
import { PlusOutlined ,QuestionCircleOutlined } from '@ant-design/icons-vue';
import { message } from "ant-design-vue";


const dataSource = ref([]);
const current = ref(1);
const perPage = ref(10);
const isVisible = ref(false);
const totalMember = ref(0);
const value = ref('');



import { useI18n } from "vue-i18n";

 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });


const columns = ref([
  {
    slotName: "number",
    dataIndex: "no",
    key: 'no',
    scopedSlots : {customRender:'number', title: 'number'}
  },
  {
    slotName: "face",
    dataIndex: "face",
    key: 'face',
    scopedSlots : {customRender:'face', title: 'face'}
  },
  // {
  //   slotName: "back",
  //   dataIndex: "back",
  //   key: 'back',
  //   scopedSlots : {customRender:'back', title: 'back'}
  // },
  // {
  //   slotName: "front",
  //   dataIndex: "front",
  //    key: 'front',
  //    scopedSlots : {customRender:'front', title: 'front'}
  // },
  {
    slotName: "create_time",
    dataIndex: "createTime",
     key: 'createTime',
     scopedSlots : {customRender:'create_time', title: 'create_time'}
  },
  {
    slotName: "cny_balance",
    dataIndex: "cnyBalance",
    key: 'cnyBalance',
    scopedSlots : {customRender:'cny_balance', title: 'cny_balance'}
  },
  {
    slotName: "status",
    dataIndex: "realNameStatus",
    key: 'realNameStatus',
    scopedSlots : {customRender:'status', title: 'status'}
  },
  {
    slotName: "up_id",
    dataIndex: "upId",
    key: 'upId',
    scopedSlots : {customRender:'up_id', title: 'up_id'}
  },
  {
    slotName: "email",
    dataIndex: "email",
    key: 'email',
    scopedSlots : {customRender:'email', title: 'email'}
  },

  {
    slotName: "username",
    dataIndex: "username",
    key: 'username',
    scopedSlots : {customRender:'username', title: 'username'}
  },
  // {
  //   title: "operation",
  //   key: "operation",
  // },
]);


function editUser(record){
console.log(record);
}



const onSearch= async (name)=>{
        let res =SEARCH_MEMBER(name,current.value,perPage.value);

        if(res.code==500){
          getMemberList();
        }else if(res.code==200){

           var list = res.obj.list;

            dataSource.value = list.map((mem, index) => {
              return {
                no: index + 1,
                face: mem.face,
                email: mem.email,
                username: mem.username,
                createTime: mem.createTime,
                upId: mem.upId,
                realNameStatus: mem.realNameStatus,
                cnyBalance: mem.cnyBalance,
                front: mem.front,
                back: mem.back,
              }
            })
        }

    
}

async function getMemberList() {
  var res = await MEMBER_LIST(current.value,perPage.value)
  
  if(res.code==500){
    dataSource.value = []
  }

  var list = res.obj.list;

  dataSource.value = list.map((mem, index) => {
    return {
      no: index + 1,
      face: mem.face,
      email: mem.email,
      username: mem.username,
      createTime: mem.createTime,
      upId: mem.upId,
      realNameStatus: mem.realNameStatus,
      cnyBalance: mem.cnyBalance,
      front: mem.front,
      back: mem.back,
    }
  })
  totalMember.value = res.obj.totalElements;
}

const refreshPage= ()=>{
  // if(totalProduct.value/perPage.value==0){
 getMemberList();

}


function closeDialog() {
 isVisible.value= false;
}

onMounted(()=> {
getMemberList();
 
})

</script>