<template>
    <a-modal
    :title="t('auth')"
    :visible="visible"
    @cancel="closeModal()"
    @ok="handleFinish"
    width="20%"

  >
     <a-form :model="formState">
      <a-form-item>
        <Select ref="select" v-model:value="formState.status"  @change="handleChange">
        <Select.Option :value=1> {{t('pending')}} </Select.Option >
        <Select.Option  :value=2> {{t('success')}}  </Select.Option >
        <Select.Option  :value=3> {{t('fail')}} </Select.Option >
      </Select>
      
      </a-form-item>
     </a-form>
    </a-modal>
</template>

<script setup>
import { onMounted, reactive, ref} from 'vue'
import {message, Select} from "ant-design-vue";
import { UPDATEORDERSTATUS } from '@/plugins/api';
const props = defineProps(['order','visible']);//eslint-disable-line
const emit = defineEmits(['closeDialog','refresh'])//eslint-disable-line

// const formRef = ref();


import { useI18n } from "vue-i18n";

 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });

       
       const formState = reactive({
        status : 2
       })

function closeModal(){
     emit('closeDialog');
}

function handleChange(value){
    console.log(value);

}

async function handleFinish(){
   const productRecordId = props.order.id;
   // let price = props.order.unitPrice;
   const memberId = props.order.memberId;
   // console.log(productRecordId,status.value,memberId)
   let res= await UPDATEORDERSTATUS(formState.status,productRecordId,memberId)
      
   .then((res)=>{
    if(res.code==200){
        message.success(t('success'),0.4);
    }
   }).catch((err)=>{
    if(err.response.status==500){
        message.error(t('fail'),0.4);
    }
   })
    emit('refresh');
    emit('closeDialog');
}

onMounted(()=>{
    
// console.log(props.order);
})

</script>

<style>

</style>