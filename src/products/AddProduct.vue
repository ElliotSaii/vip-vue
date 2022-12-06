<template>

  <a-modal
    :title="t('add_product')"
    :visible="visible"
    @cancel="closeModal()"
    @ok="handleFinish"
    width="36%"
    :cancel-text="t('cancel_txt')"
      :ok-text="t('ok_txt')"
  >
  <a-form
    ref="formRef"
    name="add product form"
    class=""
    :model="formState"
    :rules="rules"
    v-bind="layout"
    @finish="handleFinish"
   
  >    

    <a-form-item has-feedback :label="t('product_name')" name="name">
      <a-input v-model:value="formState.name" />
    </a-form-item>

    <a-form-item has-feedback :label="t('amount')" name="buyAmount"  >
      <a-input v-model:value="formState.buyAmount"  autocomplete="off" disabled v-if="formState.free =='1'"  />
      <a-input v-model:value="formState.buyAmount"  autocomplete="off"  v-if="formState.free =='0'" />
    </a-form-item>
    <a-form-item has-feedback :label="t('free')" name="free">

      <Select ref="select" v-model:value="formState.free"  @change="handleSelect">

        <Select.Option :value="0"> {{t('no')}} </Select.Option >
        <Select.Option  :value="1">{{t('yes')}}</Select.Option >

      </Select>
      
    </a-form-item>

    <a-form-item  has-feedback :label="t('time_period')" name="date">
       <a-config-provider :locale="locale === 'en' ? enUS : zhCN">
          <a-range-picker v-model:value="formState.date" show-time  @change="handleChange" :placeholder="[t('start_date'),t('end_date')]" 
            />
       </a-config-provider>
    </a-form-item>

  </a-form>
  </a-modal>

  <AddSubProduct />


</template>

<script setup>
import AddSubProduct from './AddSubProduct.vue'
import {message} from 'ant-design-vue'
import {  reactive, ref,toRaw,watch  } from 'vue';
import {Select} from "ant-design-vue";
import { AddProduct } from '@/plugins/api';
// import locale from 'ant-design-vue/es/date-picker/locale/zh_CN';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import 'dayjs/locale/zh-cn';
import dayjs from 'dayjs';

dayjs.locale('en');

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

const emit = defineEmits(['closeDialog','refresh']);// eslint-disable-line
const props = defineProps(['visible']);// eslint-disable-line
    
  
    const formRef = ref();
    const formState = reactive({
      name: '',
      buyAmount: 0,
      free: ref(0),
      date: ref()
    });

    let startTime='';
    let endTime = '';



    let checkName = async (_rule, value) => {
      if (value==='') {
        return Promise.reject(t('error_input_name'));
      } else{
        return Promise.resolve();
      }
    
    };

    let checkBuyAmount = async (_rule, value) => {
            
        if(value==='' && formState.free==0){
            return Promise.reject(t('error_input_amount'));
          }
        else if(!checkPrice(value) && formState.free==0){
            return Promise.reject(t('error_input_number'));
          } 
        else {
            return Promise.resolve();
          }
        
    };

    

    let checkDate = async(_rule,value)=>{
      if(value==='' || value===undefined){
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
          value: 1,
          label: 'true'
          },
         {
          value: 0,
          label: 'false'
          }
        ]);
  



         
        
            


  const handleSelect=value=>{
    console.log(value);
  }

    const handleChange = value => {
       startTime = value[0].format('YYYY-MM-DD HH:mm:ss');
       endTime = value[1].format('YYYY-MM-DD HH:mm:ss');

    };

    const handleFinish =async value=>{
      formRef.value.validateFields()
      .then(async(values)=>{
        console.log("Received values: ",values);
    
         console.log("startTime"+startTime +"--->endTime"+endTime);

         if(formState.buyAmount===''){
          formState.buyAmount=0;
         }

         let res = await AddProduct(formState.name,formState.buyAmount,formState.free,startTime,endTime)
          
          if(res.code==200){
              message.success(t('success'), 0.5);
              }
          else{
              message.error(t('fail'),0.5);
            }
           emit('refresh');
           emit('closeDialog');

      }).catch((info)=>{
          console.log("Validate Failed:", info);
      })

    
    }

    const getProductList = async avalue =>{
      const response = await getProductList();
      console.log(response.obj);
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


</script>