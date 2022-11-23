<template>

  <a-modal :title="t('add_guide')" :visible="visible" @cancel="closeModal()"  @ok="handleFinish"  width="23%" :cancel-text="t('cancel_txt')"
      :ok-text="t('ok_txt')">
  <a-form
    ref="formRef"
    :model="formState"
    name="basic"
  

    autocomplete="off"
    @finish="handleFinish"
  >
    <a-form-item  :label="t('title')"  name="title" :rules="[{ required: true, message: t('error_input_title') }]">
      <a-input v-model:value="formState.title" />
    </a-form-item>
  </a-form>

  </a-modal>
</template>


<script setup>
import { ADD_GUIDE } from '@/plugins/api';
import { message } from 'ant-design-vue';
import { ref , reactive} from 'vue';


const props = defineProps(['visible'])// eslint-disable-line
const emit = defineEmits(['closeDialog','refresh']);// eslint-disable-line

const formRef = ref();
const formState = reactive({
    title: '',
})

import {useI18n} from 'vue-i18n';
 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });



function closeModal(){
  emit('closeDialog')
}

const handleFinish= (value)=>{
     formRef.value
    .validateFields()
    .then(async (values) => {
      console.log("Received values of form: ", values);
     let res =await ADD_GUIDE(values.title);

     if(res.code==200){
        message.success(t("success"),0.5);
     }else{
        message.error(t('fail'),0.5);
     }

      emit('closeDialog');
      emit('refresh');
    
    })
    .catch((info) => {
      console.log("Validate Failed:", info);
    });
    
}

</script>

<style>

</style>