<template>
    <a-modal
    :title="t('withdraw_auth')"
    :visible="visible"
    @cancel="closeModal()"
    @ok="handleFinish"
    width="30%"
  
  >
     <a-form  >
      <a-form-item>
        <Select ref="select" v-model:value="formState.status"  @change="handleChange">
        <Select.Option  :value=2> {{t('success')}} </Select.Option >
        <Select.Option  :value=3> {{t('fail')}} </Select.Option >
      </Select>
      </a-form-item>
      <a-form-item :label="t('reason')" name="reason" v-if="formState.status==3"  @blur="errorReasonMsg">
      <a-input :placeholder="t('input_reason')" v-model:value="reason" />
      <span v-if="reason==''"><a-typography-text type="danger"> {{reasonText}} </a-typography-text></span>
      </a-form-item>
      <a-form-item :label="t('otp_pass')" name="otp" v-if="formState.status==2 && type==1"  @blur="errorOtpMsg">
      <a-input :placeholder="t('input_otp_pass')" v-model:value="otp" />
      <span v-if="otp==''"><a-typography-text type="danger"> {{reasonText}} </a-typography-text></span>
      </a-form-item>
     </a-form>
    </a-modal>
</template>

<script setup>
import { onMounted, reactive, ref} from 'vue'
import {message, Select} from "ant-design-vue";
import { UPDATEWITHDRAWSTATUS } from '@/plugins/api';
const props = defineProps(['withdraw','visible']);// eslint-disable-line
const emit = defineEmits(['closeDialog','refresh'])// eslint-disable-line

import {useI18n} from 'vue-i18n';
const {t}= useI18n({
  inheritLocale:true,
  useScope: "local"
})


const formState = reactive({
    status: 2
});

let reason = ref('');
let reasonText = ref('');
let otp = ref('');
let type = ref('');
function closeModal(){
     emit('closeDialog');
}

function handleChange(value){
    
 reasonText.value=''
    console.log(value);

}


function errorReasonMsg(){
    reasonText.value = t('input_reason');
}
function errorOtpMsg(){
    reasonText.value = t('error_password');
}

async function handleFinish(){

    if(formState.status==3  && reason.value===''){
       errorReasonMsg();
    
    } else if(formState.status==2 && otp.value==='' && type.value==1){
        errorOtpMsg();
    }
    else {
    const id = props.withdraw.id;
    let res= await  UPDATEWITHDRAWSTATUS(id,otp.value,formState.status,reason.value)
     .then((res)=>{
        if(res.code==200){
            message.success(t('success'),0.5);
        }
     }).catch((err)=>{
        if(err.response.status ==500 || err.response.status==400){
            message.error(t('fail'),0.5);
        }
     })
      
      reasonText.value = ''
      emit('refresh');
      emit('closeDialog');
    }   
}

onMounted(()=>{
    type.value = props.withdraw.type;
// console.log(props.withdraw);
})

</script>

<style>

</style>