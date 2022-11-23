<template>
  <div>
    <a-modal
       :visible="visible"
      :title="t('edit')"
      :confirm-loading="loading"
      @ok="handleOk"
      width="40%"
      :cancel-text="t('cancel_txt')"
      :ok-text="t('ok_txt')"
      @cancel="closeModal()"
    >
     <a-form :model="formState"   ref="formRef" layout="vertical">
         

          <a-form-item :label="t('bank_acc_name')" name= "name" :rules="[{required: true,message: t('error_input_bank_acc_name'),trigger: 'change'}]" >
            <a-input v-model:value="formState.name" :placeholder="t('bank_name')"/>
          </a-form-item>

           <a-form-item :label="t('name')" name= "bankAccName"  :rules="[{required: true,message:  t('error_input_bank_name') ,trigger: 'change'}]" >
            <a-input v-model:value="formState.bankAccName" :placeholder="t('input_bank_acc_name')"/>
          </a-form-item>

           <a-form-item :label="t('bank_acc_number')" name= "bankAccNo"  :rules="[{required: true,message: t('error_input_bank_acc_no'),trigger: 'change'}]" >
            <a-input v-model:value="formState.bankAccNo" :placeholder="t('input_bank_acc_number')"/>
          </a-form-item>

           <a-form-item :label="t('bank_branch_name')" name= "branchName"  :rules="[{required: true,message: t('error_input_bank_branch_name')}]" >
            <a-input v-model:value="formState.branchName" :placeholder="t('input_bank_acc_number')"/>
          </a-form-item>

          <a-form-item :label="t('bank_version')" name="version">
            <Select ref="select" v-model:value="formState.version"  @change="handleChange">
            <Select.Option  :value="2">{{t('bank_available')}} </Select.Option >
            <Select.Option  :value="3">{{t('bank_not_available')}} </Select.Option >
           </Select>
          </a-form-item>

     </a-form>

    </a-modal>
  </div>
</template>
<script setup>

import { onMounted, reactive, ref } from 'vue';
import {message, Select} from "ant-design-vue";
import {useI18n} from 'vue-i18n'
import {EDIT_BANK } from '@/plugins/api';

const emit = defineEmits(['refresh','closeDialog'])// eslint-disable-line
const props = defineProps(['visible','bank']) // eslint-disable-line

const formRef =ref("")
const formState = reactive({
  name: '',
  version: 2,
  bankAccName: '',
  bankAccNo: '',
  branchName: ''
})
let bankId = '';
 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });

const handleChange=(value)=>{
console.log('selected '+value);
}

const handleOk = async()=>{
   formRef.value
    .validateFields()
    .then(async(values)=>{

        
    console.log("Form Received :",bankId,values);


   let response =await EDIT_BANK(bankId,values).then((res)=>
   {
       if(res.code==200){
      message.success(t('success'),0.5);
      emit('refresh');
    
    }
   }).catch((err)=>{
    message.error(t('fail'),0.5)
   })
      


      emit('closeDialog')


  })
  .catch((info)=>{
    console.log("Validated Failed ",info);
  })
  
}
 
 
function closeModal(){
    emit('closeDialog')
}
 
   onMounted(()=>{
    let bank =props.bank;
     bankId = bank.id;
     formState.name=bank.name;
     formState.bankAccName=bank.accountName;
     formState.bankAccNo=bank.accountNo;
     formState.version =bank.banKVersion;
     formState.branchName=bank.branchName;
   })
</script>

<style scoped>
.avatar-uploader-editor{
  display: none;
}

</style>