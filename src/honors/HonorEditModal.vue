<template>
  <a-modal
    :title="t('edit')"
    :visible="visible"
    @cancel="closeModal()"
    @ok="onOk"
    :cancel-text="t('cancel_txt')"
      :ok-text="t('ok_txt')"
    width="40%"
  
  >
 <a-form ref="formRef" :model="formState"  layout="vertical" name="form_in_modal">

      <a-form-item   name="imageUrl" :label="t('image')" >
        <FileUpload @imageLink="imageUrlLink" v-model:value="formState.imageUrl" :picture="selectedPic" />
      </a-form-item>

      <a-form-item name="email" :label="t('email')">
        <a-input v-model:value="formState.email" @change="handleEmail" />
         <a-typography-text type="danger" v-if="emailErr!==''" >{{emailErr}} </a-typography-text>
      </a-form-item>

     <a-form-item name="description"  :label="t('description')">
       <a-textarea v-model:value="formState.description" :placeholder="t('editor_placeholder')" @change="handleDescription" />
       <a-typography-text type="danger" v-if="descriptionErr!==''" >{{descriptionErr}} </a-typography-text>
      </a-form-item> 

    </a-form>

   

         
  </a-modal>
</template>

<script setup>
import { ADD_GUIDE, EDIT_HONOR } from '@/plugins/api';
import { message } from 'ant-design-vue';
import { ref , reactive, onMounted} from 'vue';
import FileUpload from '../file-upload/FileUpload.vue'

const props = defineProps(['visible','honor'])// eslint-disable-line
const emit = defineEmits(['closeDialog','refresh']);// eslint-disable-line

let descriptionErr = ref('');
let emailErr = ref('')


const selectedPic = ref()
const formRef = ref();
const formState = reactive({
    email: '',
    description: '',
    imageUrl: ''
})

import {useI18n} from 'vue-i18n';
 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });


const  imageUrlLink= (value)=>{
  const link = value.link;
 formState.imageUrl = link;
}


function closeModal(){
  emit('closeDialog')
}


function handleDescription(){
    if(formState.description==='' || formState.description===null){

        descriptionErr.value = t('error_input_description');
    }else{
        descriptionErr.value = ''
    }
}
function handleEmail(){
    if(formState.email === ''){
        emailErr.value = t('error_input_email');
    }else{
         emailErr.value = "";
    }
}

function checkDescription(value) {
     
     if(value==null || value===''){
        return true;
     }else{
        return false;
     }
}


const onOk = ()  => {
  formRef.value
    .validateFields()
    .then(async (values) => {
      console.log("Received values of form: ", values);
         
         if (!checkDescription(values.description) && values.email!==''){
           let id =props.honor.id;
         let res =await EDIT_HONOR(id,formState.email, formState.description, formState.imageUrl)
              if(res.code==200){
                message.success(t('success'),0.5);
              }
               else{
                message.error(t('fail'),0.5);
               }

                // clearAllField()
                emit('closeDialog');
                emit('refresh');
                
            
                }
             else{
                handleDescription();
                handleEmail()
             }

          
    
    
    })
    .catch((info) => {
      console.log("Validate Failed:", info);
    });
};

onMounted(()=>{
    let honor = props.honor;
    formState.email=honor.email;
    formState.description=honor.description;
    formState.imageUrl =honor.imageUrl;
    selectedPic.value=honor.imageUrl;

 
  

})

</script>

<style>

</style>