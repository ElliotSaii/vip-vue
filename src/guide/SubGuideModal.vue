<template>

  <a-modal :title="t('add_guide')" :visible="visible" @cancel="closeModal()"  @ok="handleFinish"  width="40%" :cancel-text="t('cancel_txt')"
      :ok-text="t('ok_txt')">
  <a-form :model="formState" ref="formRef" name="basic" layout="vertical" autocomplete="off" @finish="handleFinish"
  >
    <a-form-item  :label="t('title')"  name="title" :rules="[{ required: true, message: t('error_input_title') }]">
      <a-input v-model:value="formState.title" />
    </a-form-item>
    
    <a-form-item :label="t('description')" name ="description"  :rules="[{ required: true, message: t('error_input_description') }]" >
     <QuillEditor  style="min-height:320px;" v-model:content="formState.description"  contentType="html"     :options="options"  ref="myEditor"  />
    </a-form-item>

    <a-form-item 
      class="avatar-uploader-editor input">
        <FileUpload  @imageLink="uploadSuccess"  />
    </a-form-item>

    
 <a-form-item   >
        <VideoUpload  @imageLink="uploadVideo" v-if="videoUrl===''"  />
</a-form-item>

  </a-form>


  </a-modal>
</template>


<script setup>
import VideoUpload from '../file-upload/VideoUpload.vue'
import FileUpload from "../file-upload/FileUpload.vue";
import { ADD_GUIDE, ADD_SUB_GUIDE } from '@/plugins/api';
import { Empty, message } from 'ant-design-vue';
import { ref , reactive, onMounted} from 'vue';
import { QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';


import {useI18n} from 'vue-i18n';
 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });

const props = defineProps(['visible','guide'])// eslint-disable-line
const emit = defineEmits(['closeDialog','refresh']);// eslint-disable-line

const myEditor = ref(null);

let  videoUrl =''

const formRef = ref();
const formState = reactive({
    title: '',
    description: '',
   
})


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



const uploadVideo=(value)=>{
if (value) {
       console.log(value);
          var videoLink=value.link;
           videoUrl =videoLink;
  
        } else {
        //   this.$message.error('图片插入失败')
        }
}

function descrptionChange(){

  console.log("=========="+formState.description);
}

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



function closeModal(){
  emit('closeDialog')
}



const handleFinish= async()=>{
    formRef.value
    .validateFields()
    .then(async (values) => {
            const guideId = props.guide.id;
     
      
             
           let res =await ADD_SUB_GUIDE(guideId,values.title,values.description,videoUrl);
           
      
           if(res.code==200){
              message.success(t('success'),0.5);
           }else{
              message.error(t('fail'),0.5);
           }
            emit('closeDialog');
            emit('refresh');
    }).catch((info)=>{
      console.log("Validate Failed:",info);
    })
    
    
    
}

onMounted(()=>{

})

</script>

<style>
.avatar-uploader-editor{
  display: none;
}
/* 
.avatar-uploader-editor-video{
  display: none;
} */

</style>