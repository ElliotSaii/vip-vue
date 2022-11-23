<template>

  <a-modal :title="t('edit_product')" :visible="visible" @cancel="closeModal()" @ok="handleFinish" width="36%" :cancel-text="t('cancel_txt')"
      :ok-text="t('ok_txt')">
  <a-form ref="formRef" name="add product form" class="" :model="formState" :rules="rules" v-bind="layout" @finish="handleFinish">    

    <a-form-item has-feedback :label="t('name')" name="name">
      <a-input v-model:value="formState.name" />
    </a-form-item>

    <a-form-item has-feedback :label="t('amount')" name="buyAmount">
      <a-input v-model:value="formState.buyAmount"  autocomplete="off" />
    </a-form-item>
    <a-form-item has-feedback :label="t('free')" name="free">

      <Select ref="select" v-model:value="formState.free"  @change="handleSelect">
        <Select.Option :value="0"> {{t('no')}} </Select.Option >
        <Select.Option  :value="1"> {{t('yes')}} </Select.Option >
      </Select>
      
    </a-form-item>

    <a-form-item  has-feedback :label="t('time_period')" name="date">
    <a-config-provider :locale="locale === 'en' ? enUS : zhCN">
          <a-range-picker v-model:value="formState.date" show-time  @change="handleChange" :format="dateFormat" :placeholder="[t('start_date'),t('end_date')]" 
            />
       </a-config-provider>
    </a-form-item>
  </a-form>
  </a-modal>




</template>

<script setup>

import {message} from 'ant-design-vue'
import {  onMounted, reactive, ref,toRaw ,watch } from 'vue';
import {Select} from "ant-design-vue";

// import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';

import { EDIT_PRODUCT } from '@/plugins/api';
const emit = defineEmits(['closeDialog','refresh']);// eslint-disable-line
const props = defineProps(['visible','product']);// eslint-disable-line

   import { useI18n } from "vue-i18n";
     const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });

const locale = ref(localStorage.getItem('lang'));

    watch(()=>{
      (locale, val => {
      dayjs.locale(val);
     
    });
    })

    const dateFormat = 'YYYY-MM-DD HH:mm:ss';
    const formRef = ref();
    const formState = reactive({
      name: '',
      buyAmount: '',
      free: ref(0),
      date: ref(),
      // date: ref(),
    });

    const startTime= ref('');
    const endTime = ref('');


    let checkName = async (_rule, value) => {
      if (value==='') {
        return Promise.reject(t('error_input_name'));
      } else{
        return Promise.resolve();
      }
    
    };

    let checkBuyAmount = async (_rule, value) => {
            
        if(value===''){
            return Promise.reject(t('error_input_amount'));
          }
        else if(!checkPrice(value)){
            return Promise.reject(t('error_input_number'));
          } 
          else{
            return Promise.resolve();
          }

    };
    let checkDate = async(_rule,value)=>{
      if(value==='' || value===undefined || value ===null){
        return Promise.reject(t('error_time_period'));
      }else{
        return Promise.resolve();
      }
    }

      function checkPrice(checkVal) {
        const myreg = /^(?:\d*\.\d{1,9}|\d+)$/
        if(myreg.test(checkVal)){
            return true;
        }else{
          return false;
        }
    }
     
     const resetForm = () => {
          formRef.value.resetFields();
     };

    const option = ref([
          {
          value: true,
          label: 'true'
          },
         {
          value: false,
          label: 'false'
          }
        ]);
   
   const handleSelect=(value)=>{
    console.log(value);
   }

    const handleChange = value => {
       startTime.value = value[0].format('YYYY-MM-DD HH:mm:ss');
       endTime.value = value[1].format('YYYY-MM-DD HH:mm:ss');

    };

    const handleFinish =async value=>{
      formRef.value.validateFields()
      .then(async(values)=>{
        console.log("Received values: ",values);
    
         console.log("startTime"+startTime.value +"\nendTime"+endTime.value);
         const id = props.product.productId;
         let res = await EDIT_PRODUCT(id,formState.name,formState.buyAmount,formState.free,startTime.value,endTime.value); 
          if(res.code==200){
              message.success('Operation success', 0.5);
              }
          else{
              message.error('failed',0.7);
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
      name: [{
        required: true,
        validator: checkName,
        trigger: 'change',
      }],
   
      buyAmount: [{
        validator: checkBuyAmount,
        trigger: 'change',
      }],
      date: [{
        validator: checkDate,
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

onMounted(()=>{
    let product =props.product;
    formState.name=product.name;
    formState.buyAmount =product.buyAmount
    formState.free =(product.free===false)? 0 : 1
    startTime.value =product.startTime
    endTime.value =product.endTime;
    formState.date = [dayjs(product.startTime,dateFormat), dayjs(product.endTime,dateFormat)]
    console.log("mounted=>"+endTime.value);
    console.log("mounted=>"+startTime.value);
    console.log("eee",product);
})

</script>