<template>
  <div>
    <a-modal
       :visible="visible"
      title="Application"
      :confirm-loading="loading"
      @ok="handleOk"
      width="40%"
      :cancel-text="t('cancel_txt')"
      :ok-text="t('ok_txt')"
      @cancel="closeModal()"
    >
     <a-form :model="formState" :rules="rules"   ref="formRef" layout="vertical">
         <a-form-item :label="t('platform')" name="platform">
            <Select ref="select" v-model:value="formState.platform"  @change="handleChange">
            <Select.Option :value="1"> {{t('andriod')}} </Select.Option >
            <Select.Option  :value="2">{{t('ios')}} </Select.Option >
           </Select>
          </a-form-item>

          <a-form-item :label="t('name')" name= "name" >
            <a-input v-model:value="formState.name" :placeholder="t('input_app_name')"/>
          </a-form-item>

           <a-form-item :label="t('version')" name= "version" >
            <a-input v-model:value="formState.version" :placeholder="t('input_app_version')"/>
          </a-form-item>
          <a-form-item :label="t('upload_app')" name="uploadLink" @change="uploadChange">
          <AppUpload @uploadLink="uploadUrlLink" v-model:value="formState.uploadLink"  />
          <a-typography-text type="danger" v-if="uploadErrText!=''" >{{uploadErrText}} </a-typography-text>
          </a-form-item>

      <a-form-item name="description"  :label="t('description')" @change="clearInput('name')" >
       <QuillEditor  style="min-height: 240px" v-model:content="formState.description"  contentType="html"   :options="options"  ref="myEditor" 
        />
         
      </a-form-item> 

    <a-form-item class="avatar-uploader-editor input">
        <FileUpload  @imageLink="uploadSuccess"  />
    </a-form-item>
       

     </a-form>

    </a-modal>
  </div>
</template>
<script setup>
import FileUpload from '../file-upload/FileUpload.vue'
import AppUpload from '../file-upload/AppUpload.vue'
import {QuillEditor} from '@vueup/vue-quill'
import { reactive, ref } from 'vue';
import {message, Select} from "ant-design-vue";
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { APP_RELEASE } from '@/plugins/api';

const emit = defineEmits(['refresh','closeDialog'])// eslint-disable-line
const props = defineProps(['visible']) // eslint-disable-line

const formState = reactive({
  platform: 1,
  name: '',
  version: '',
  uploadLink: '',
  description: ''


})
let descriptionErrText = ref('')
let uploadErrText= ref('')
const formRef =ref("" )
const myEditor = ref('');


import {useI18n} from 'vue-i18n'

 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });


const options={
          theme: 'snow',
          bounds: document.body,
          debug: 'warn',
          modules: {
            toolbar: {
              container: [
                ['bold', 'italic', 'underline', 'strike'],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],
                [{ size: ['small', false, 'large', 'huge'] }],
                [{ color: [] }, { background: [] }],
                ['blockquote', 'code-block'],
                [{ list: 'ordered' }, { list: 'bullet' }],
                [{ script: 'sub' }, { script: 'super' }],
                [{ indent: '-1' }, { indent: '+1' }],
                [{ align: [] }],
                [{ direction: 'rtl' }],
                [{ font: [] }],
                ['clean'],
                ['link', 'image'],
              ],
              handlers: {
                "image": function (value) {
                  if (value) {
                    // 触发input框选择图片文件
                    document.querySelector('.avatar-uploader-editor input').click()
                  } else {
                    this.quill.format('image', false);
                  }
                }
  
              },
            },
          },
          placeholder: t('editor_placeholder'),
          readOnly: false,
         
        };

 let checkName = async (_rule, value) => {
      if (value === '') {
        return Promise.reject(t('input_app_name'));
      } else {
        return Promise.resolve();
      }
    };

 let checkVersion = async (_rule, value) => {
      if (value === '') {
        return Promise.reject(t('input_app_version'));
      } else {
        return Promise.resolve();
      }
    };

    let checkUpload =  async (_rule, value) => {
      if (value === '') {
        uploadErrText.value = t('error_upload_file')
        return Promise.reject();
      } else {
         uploadErrText.value = ''
        return Promise.resolve();
      }
    };
    let checkDescription =  async (_rule, value) => {
         const reg =/(?!<(img).*?>)<.*?>/g
         const strings = value.replace(reg,'')
      if (value === '') {
        return Promise.reject(t('error_input_description'));
      } else if(strings.match(/^[ ]*$/)){

         return Promise.reject(t('error_input_description'));
      }
      
      else {
        descriptionErrText.value =''
        return Promise.resolve();
      }
    };

    const clearInput = (value)=>{
      this.$refs['formRef'].validateField(value);
       
    }

    const uploadChange=()=>{
      uploadErrText.value =''
    }

   
    const rules = {
      name: [{
        required: true,
        validator: checkName,
        trigger: 'change',
      },],
      version: [{
        required: true,
        validator: checkVersion,
        trigger: 'change',
      },],
      uploadLink: [{
        required: true,
        validator: checkUpload,
        trigger: 'change',
      },],
      description: [{
        required: true,
        validator: checkDescription,
        trigger: 'change',
      },],
    }

    const uploadSuccess=(value)=>{
if (value) {
          // 获取光标所在位置
          var imageUrl=value.link;
         var length=myEditor.value.getQuill().getSelection(true).index
          myEditor.value.getQuill().insertEmbed(length, 'image', imageUrl)
        // myEditor.value.setHTML( formState.description +=imageUrl);

        console.log(imageUrl);
        } else {
        //   this.$message.error('图片插入失败')
        }
}
    


const loading = ref(false);

const handleChange=(value)=>{
console.log('selected '+value);
}

const  uploadUrlLink=(value)=>{
    const link = value.link;
    // console.log(value);
    formState.uploadLink = link;
}

const handleOk = async()=>{
   formRef.value
    .validateFields()
    .then(async(values)=>{
    console.log("Form Received :",values);
      
    let res = await APP_RELEASE(values);

    if(res.code==200){
      message.success(t('success'),0.5);
      emit('refresh');
    
    }else{
      message.error(t('fail'),0.5)
    }
      emit('closeDialog')
    // if(myEditor.value.getText()===''){
    //  descriptionErrText.value = 'Please enter description'
    //  console.log("true");
    // }else{

    //   console.log(myEditor.value.getText()  );
    // }

  })
  .catch((info)=>{
    console.log("Validated Failed ",info);
  })
  
}


function closeModal(){
    emit('closeDialog')
}
 
   

</script>

<style scoped>
.avatar-uploader-editor{
  display: none;
}

</style>