<template>

  <a-modal
    :title="t('add')"
    :visible="visible"
    @cancel="closeModal()"
    @ok="handleFinish"
    width="30%"
    :cancel-text="t('cancel_txt')"
      :ok-text="t('ok_txt')"
   
  >
  <a-form
    ref="formRef"
    name="使改变"
    class=""
    :model="formState"
    :rules="rules"
    v-bind="layout"
    @finish="handleFinish">

    <a-form-item has-feedback :label="t('min_amt')" name="minAmount">
      <a-input v-model:value="formState.minAmount" />
    </a-form-item>

    <a-form-item has-feedback :label="t('max_amt')" name="maxAmount">
      <a-input v-model:value="formState.maxAmount"  autocomplete="off" />
    </a-form-item>
    <a-form-item has-feedback :label="t('fee_rate')" name="fee">
      <a-input v-model:value="formState.fee"  autocomplete="off" />
    </a-form-item>
  </a-form>
  </a-modal>




</template>

<script setup>
import { SETWITHDRAWFEE } from '@/plugins/api';
import {message} from 'ant-design-vue'
import {  reactive, ref,toRaw  } from 'vue';

const props = defineProps(['visible'])// eslint-disable-line
const emit = defineEmits(['closeDialog','refresh']);// eslint-disable-line
 const withdrawId = "101";

    const formRef = ref();
    const formState = reactive({
      minAmount: '',
      maxAmount: '',
      fee: ''
    });

import { useI18n } from "vue-i18n";

 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });

    let checkMinAmount= async (_rule, value) => {
      if (value==='') {
        return Promise.reject(t('error_input_min'));
     }else if(isNumber(value)){
        return Promise.reject(t('error_input_number'))
     }
      else{
        return Promise.resolve();
      }
    
    };

    let checkMaxAmount = async (_rule, value) => {
            
        if(value===''){
            return Promise.reject(t('error_input_max'));
          }else if(isNumber(value)){
            return Promise.reject(t('error_input_number'))
          }
          else{
            return Promise.resolve();
          }

    };
    let checkFee = async (_rule, value) => {
            
        if(value===''){
            return Promise.reject(t('error_input_fee'));
          }else if(isNumber(value)){
            return Promise.reject(t('error_input_number'))
          }else if(!isUnder100(value)){
            return Promise.reject(t('error_input_fee_exeed'))
          }
          else{
            return Promise.resolve();
          }

    };

    function isNumber(value){
        return (isNaN(value));
    }
    function isUnder100(value){
        let number =parseInt(value);
        if(number>=0 && number<=100){
            return  true;
        }else{
            return false;
        }
    }

     const resetForm = () => {
          formRef.value.resetFields();
     };

    


    const handleChange = value => {
      console.log(`selected ${value}`);
    };

    const handleFinish =async value=>{
      formRef.value.validateFields()
      .then(async(values)=>{
        const id = 101;        
       let res = await SETWITHDRAWFEE(id,values.minAmount,values.maxAmount,values.fee);
         
         if(res.code ==200){
            message.success(t('success'),0.5);
         }else{
            message.error(t('fail'), 0.5);
         }

           emit('refresh');
           emit('closeDialog');

      }).catch((info)=>{
          console.log("Validate Failed:", info);
      })

    
    }


function closeModal() {
  emit('closeDialog');
}

    const rules = {
      minAmount: [{
        required: true,
        validator: checkMinAmount,
        trigger: 'change',
      }],
   
      maxAmount: [{
        validator: checkMaxAmount,
        trigger: 'change',
      }],
      fee: [{
        validator: checkFee,
        trigger: 'change',
      }],
    };
    const layout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    };


</script>