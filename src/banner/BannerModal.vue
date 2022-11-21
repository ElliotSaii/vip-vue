<template>
  <a-modal :title="t('add_image')" :visible="visible"  @cancel="closeModal()"  @ok="handleFinish" width="25%">
  <a-form  ref="formRef"  name="add banner form"   class=""  :model="formState"    @finish="handleFinish">
    <a-form-item name="imageUrl" :rules="[{required: true, message: t('error_input_image_host')}]">
        <FileUpload @imageLink="imageUrlLink" v-model:value="formState.imageUrl"  />
      </a-form-item>
  </a-form>
  </a-modal>




</template>

<script setup>
import { BANNER_ADD } from '@/plugins/api';
import {message} from 'ant-design-vue'
import {  reactive, ref  } from 'vue';
import FileUpload from '../file-upload/FileUpload.vue'
const props = defineProps(['visible'])// eslint-disable-line
const emit = defineEmits(['closeDialog','refresh']);// eslint-disable-line

import {useI18n} from 'vue-i18n';
const {t}= useI18n({
  inheritLocale:true,
  useScope: "local"
})
    const formRef = ref();
    const formState = reactive({
      imageUrl: '',
    });

    const handleFinish =async value=>{
      formRef.value.validateFields()
      .then(async(values)=>{    
        
        console.log(values);
            
           let res =await BANNER_ADD(values)
            
            if(res.code==200){
                message.success(t('success'),0.5);
                emit('refresh');
                emit('closeDialog');
            }else{
              message.error(t('fail'),0.5)
            }


      }).catch((info)=>{
          console.log("Validate Failed:", info);
      })

    
    }

    const  imageUrlLink= (value)=>{
  const link = value.link;
 formState.imageUrl = link;
}

function closeModal() {
  emit('closeDialog');
}



</script>