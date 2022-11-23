<template>
  <a-modal  :title="t('edit')"  :visible="visible"  @cancel="closeModal()" @ok="handleFinish()"  width="40%"  :cancel-text="t('cancel_txt')"    :ok-text="t('ok_txt')">
    <a-form ref="formRef"  :model="formState" :rules="rules" layout="vertical" name="form_in_modal">
 
 <a-form-item name="name"  :label="t('sub_product_name')">
        <a-input v-model:value="formState.name" />
 </a-form-item>

      <a-form-item name="unitPrice" :label="t('unit_price')">
        <a-input v-model:value="formState.unitPrice" />
      </a-form-item>

      <a-form-item  name="imageUrl" :label="t('upload_img')">
        <FileUpload @imageLink="imageUrlLink" v-model:value="formState.imageUrl" :picture="selectedPic" />
      </a-form-item>

      <a-form-item name="fromImgUrl" :label="t('from_link')">
        <a-input v-model:value="formState.fromImgUrl" />
      </a-form-item> 

      <a-form-item name="free" :label="t('free')">
        <Select ref="select" v-model:value="formState.free"  @change="handleChange">
        <Select.Option :value="0"> {{t('no')}} </Select.Option >
        <Select.Option  :value="1"> {{t('yes')}}</Select.Option >
      </Select>
      </a-form-item> 

      
      
     <a-form-item name="description" :label="t('description')" >
       <QuillEditor  style="min-height:120px;" v-model:content="formState.description"  contentType="html"   :options="options" ref="myEditor" />
      </a-form-item> 

    </a-form>
  </a-modal>
   
</template>
<script setup>
import FileUpload from '../file-upload/FileUpload.vue'
import { QuillEditor} from '@vueup/vue-quill'
import {message} from 'ant-design-vue'
import {  onMounted, reactive, ref,toRaw ,watch } from 'vue';
import {Select} from "ant-design-vue";



import { EDIT_PRODUCT, EDIT_SUB_PRODUCT } from '@/plugins/api';
const emit = defineEmits(['closeDialog','refresh']);// eslint-disable-line
const props = defineProps(['visible','subproduct']);// eslint-disable-line

   import { useI18n } from "vue-i18n";
     const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });

const selectedPic = ref();

const myEditor = ref(null)


    const formRef = ref();
    const formState = reactive({
        name: "",
        unitPrice: "",
        imageUrl: "",
        fromImgUrl: "",
        free: ref(),
        description: null
    
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
                ['link'  ],
              ],
              handlers: {
              },
            },
          },
          placeholder: t('editor_placeholder'),
          readOnly: false,
        };

  
   let checkName = async (_rule, value) => {
      if (value==='') {
        return Promise.reject(t('error_input_name'));
      } else{
        return Promise.resolve();
      }
    
    };

    function checkPrice(checkVal) {
        const myreg = /^(?:\d*\.\d{1,9}|\d+)$/
        if(myreg.test(checkVal)){
            return true;
        }else{
          return false;
        }
    }

let checkUnitPrice = async(_rule,value)=>{

  if(value===''){
    return Promise.reject(t('error_input_unit_price'));
  }
   else if(!checkPrice(value)){
    return Promise.reject(t('error_input_number'));
  } 
  else{
    return Promise.resolve();
  }
}

let checkImageUpload = async(_rule,value)=>{

  if(value===''){
    return Promise.reject(t('error_input_image_host'));//'Please upload image'
  }else{
    return Promise.resolve();
  }
}

let checkImageFromUrl = async(_rule,value)=>{
  if(value===''){
    return Promise.reject(t('error_input_image_host'));
  }
  else{
    return Promise.resolve();
  }
}


    const rules = {
      name: [{
        required: true,
        validator: checkName,
        trigger: 'change',
      }],
   
      imageUrl: [{
        validator: checkImageUpload,
        trigger: 'none',
      }],
      unitPrice: [{
        validator: checkUnitPrice,
        trigger: 'change'
      }],
      fromImgUrl: [{
        validator: checkImageFromUrl,
        trigger: 'change'
      }]
    };




     
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
   
   const handleSelect=(value)=>{
    console.log(value);
   }



    const handleFinish =async value=>{
      formRef.value.validateFields()
      .then(async(values)=>{
        console.log("Received values: ",values);
    
        
          const id = props.subproduct.subId;
         let res = await EDIT_SUB_PRODUCT(id,values); 
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
    const layout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    };

    const imageUrlLink=(value)=>{
     formState.imageUrl =value.link;
    }

onMounted(()=>{
    let sub =props.subproduct;
    formState.name=sub.subName;
    formState.unitPrice =sub.unitPrice
    formState.free =(sub.free===false)? 0 : 1
    selectedPic.value = sub.imageUrl
    formState.imageUrl = sub.imageUrl;
    formState.fromImgUrl =sub.fromImgUrl
    myEditor.value.setHTML( formState.description = sub.description)


   
})

</script>