<template>
  <a-modal
    :title="t('add_honor')"
    :visible="visible"
    @cancel="closeModal()"
    @ok="onOk"
    width="40%"
  
  >
 <a-form ref="modalFormRef" :model="modalFormState"  layout="vertical" name="form_in_modal">

      <a-form-item   name="imageUrl" label="" v-if="modalFormState.imageLink==''">
        <FileUpload @imageLink="imageUrlLink" v-model:value="modalFormState.imageUrl"   />
      </a-form-item>

      <a-form-item   v-if="modalFormState.imageLink!=''" >
       <a-image width="85px" :src="modalFormState.fromImageLink"  />
      </a-form-item> 

      <a-form-item name="imageLink" :label="t('from_link')" v-if="modalFormState.imageUrl==''">
        <a-input v-model:value="modalFormState.imageLink"  @change="inputImageLink()" />    
      </a-form-item> 

      <a-form-item name="email" :label="t('email')">
        <a-input v-model:value="modalFormState.email" @change="handleEmail" />
         <a-typography-text type="danger" v-if="emailErr!==''" >{{emailErr}} </a-typography-text>
      </a-form-item>

     <a-form-item name="description"  :label="t('description')">
       <a-textarea v-model:value="modalFormState.description" :placeholder="t('editor_placeholder')" @change="handleDescription" />
       <a-typography-text type="danger" v-if="descriptionErr!==''" >{{descriptionErr}} </a-typography-text>
      </a-form-item> 

    </a-form>

   
    <template #footer>
      <a-button key="back" @click="closeModal()"> {{t('no_txt')}} </a-button>
      <a-button key="submit" type="primary" @click="onOk" > {{t('yes_txt')}} </a-button>
    </template>
         
  </a-modal>
</template>

<script setup>
import FileUpload from "../file-upload/FileUpload.vue";
import { ref, reactive, toRaw, onMounted} from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import {  QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import {  ADD_HONOR } from "@/plugins/api";
import { message } from "ant-design-vue";




const props = defineProps([ 'visible']);// eslint-disable-line
const emit = defineEmits(['closeDialog',"refresh"]);// eslint-disable-line

let closeImage = ref('');

let descriptionErr = ref('');
let emailErr = ref('')

import {useI18n} from 'vue-i18n';
const {t}= useI18n({
  inheritLocale:true,
  useScope: "local"
})


const modalFormRef = ref();
const modalFormState = reactive({
  email: "",
  imageUrl: "",
  imageLink: "",
  fromImageLink: '',
  description: null
});

function inputImageLink(){
  modalFormState.fromImageLink = modalFormState.imageLink;
}

const onOk = ()  => {
  modalFormRef.value
    .validateFields()
    .then(async (values) => {
      console.log("Received values of form: ", values);
         
         if (!checkDescription(values.description) && values.email!==''){
          let res = await  ADD_HONOR(values.email,values.description,values.imageLink,values.imageUrl);
              if(res.code==200){
                message.success(t('success'),0.5);
              }
               else{
                message.error(t('fail'),0.5);
               }

                clearAllField()
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


function handleDescription(){
    if(modalFormState.description==='' || modalFormState.description===null){

        descriptionErr.value = t('error_input_description');
    }else{
        descriptionErr.value = ''
    }
}
function handleEmail(){
    if(modalFormState.email === ''){
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

function clearAllField(){
    modalFormState.email= "",
  modalFormState.imageUrl= "",
  modalFormState.imageLink= "",
  modalFormState.fromImageLink= '',
  modalFormState.description= null

}


function closeModal() {
 descriptionErr.value = '';
 emailErr.value ='';

  emit('closeDialog');
}

const  imageUrlLink= (value)=>{
  const link = value.link;
 modalFormState.imageUrl = link;
}

onMounted(() => {
    console.log("======"+modalFormState.imageUrl);
})
</script>

<style>
</style>