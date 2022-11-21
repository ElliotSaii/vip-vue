<template>

  <a-modal :title="t('edit_guide')" :visible="visible" @cancel="closeModal()"  @ok="handleFinish"  width="40%" >
  <a-form
    ref="formRef"
    :model="formState"
    name="basic"
    layout="vertical"
    autocomplete="off"
    @finish="handleFinish"
  >
    <a-form-item  :label="t('title')"  name="title" :rules="[{ required: true, message: t('error_input_title') }]">
      <a-input v-model:value="formState.title" />
    </a-form-item>
    
    <a-form-item :label="t('description')" name ="description"  :rules="[{ required: true, message: t('error_input_description') }]">
     <QuillEditor  style="min-height:120px;" v-model:content="formState.description"  contentType="html"  theme="snow"  :options="options" 
     
     ref="myEditor" />
    </a-form-item>

    <a-form-item   class="avatar-uploader-editor input">
            <FileUpload  @imageLink="uploadSuccess"  />
    </a-form-item>
</a-form>

  </a-modal>
</template>


<script setup>

import { message } from 'ant-design-vue';
import { ref , reactive, onMounted} from 'vue';
import { QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import FileUpload from "../file-upload/FileUpload.vue";
import { EDIT_SUB_GUIDE } from '@/plugins/api';
const props = defineProps(['visible','subGuide'])// eslint-disable-line
const emit = defineEmits(['closeDialog','refresh']);// eslint-disable-line

import {useI18n} from 'vue-i18n';
 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });


 const myEditor= ref(null)

const formRef = ref();
const formState = reactive({
    title: '',
    description: '',
})

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
                ['link', 'image', 'vab-upload-image'],
              ],
              handlers: {
                "image": function (value) {
                  if (value) {
                    // 触发input框选择图片文件
                    document.querySelector('.avatar-uploader-editor input').click()
                  } else {
                    this.quill.format('image', false);
                  }
                },
                'vab-upload-image': () => {
                  this.$baseConfirm(
                    '演示环境未使用真实文件服务器，故图片上传回显不会生效，开发时请修改为正式文件服务器地址',
                    '开发注意事项！！！',
                    () => {
                      this.$refs['vabUpload'].handleShow()
                    },
                    () => {
                      this.handleAddImg()
                    },
                    '模拟打开文件上传',
                    '模拟添加一张文件服务器图片'
                  )
                },
              },
            },
          },
          placeholder: t('editor_placeholder'),
          readOnly: false,
        };




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
function closeModal(){
  emit('closeDialog')
}

const handleFinish= ()=>{
     formRef.value
    .validateFields()
    .then(async (values) => {
 
 const id= props.subGuide.id;

      console.log("Received values of form: ", values);

     let res =await EDIT_SUB_GUIDE(id,values.title,values.description)
      
     if(res.code==200){
        message.success(t('success'),0.5);
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


onMounted(()=>{
    formState.title= props.subGuide.title
    myEditor.value.setHTML(formState.description =props.subGuide.description);

})
</script>

<style>
.avatar-uploader-editor {
    display: none;
    /* width:0.1px;
    height:0.1px; */
}
</style>