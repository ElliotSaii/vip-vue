<template>
  <a-modal
    :title="t('add_sub_product')"
    :visible="visible"
    @cancel="closeModal()"
    @ok="onOk"
    width="40%"
    :cancel-text="t('cancel_txt')"
      :ok-text="t('ok_txt')"
  >
    <a-form
  ref="modalFormRef" 
  :model="modalFormState"
  :rules="rules"
  layout="vertical"
  name="form_in_modal"
   
    >
 
 <a-form-item
        name="name"
        :label="t('sub_product_name')"
        
      >
        <a-input v-model:value="modalFormState.name" />
      </a-form-item>
      <a-form-item
        name="unitPrice"
        :label="t('unit_price')"
      >
        <a-input v-model:value="modalFormState.unitPrice" />
      </a-form-item>

      <a-form-item 
      name="imageUrl"
      :label="t('upload_img')">

        <FileUpload @imageLink="imageUrlLink" v-model:value="modalFormState.imageUrl"  />
      </a-form-item>
      <a-form-item
        name="fromImgUrl"
        :label="t('from_link')"
      >
        <a-input v-model:value="modalFormState.fromImgUrl" />
      </a-form-item> 

      <!-- <a-form-item
        name="free"
        :label="t('free')"
      >
        <Select ref="select" v-model:value="modalFormState.free"  @change="handleChange">

        <Select.Option value="false"> {{t('no')}} </Select.Option >
        <Select.Option  value="true"> {{t('yes')}}</Select.Option >

      </Select>
      </a-form-item>  -->

      
      
     <a-form-item
       name="description"
        :label="t('description')"
      >
       <QuillEditor  style="min-height:120px;" v-model:content="modalFormState.description"  contentType="html"   :options="options" />
      </a-form-item> 

    </a-form>

   
   
   
         
  </a-modal>
</template>

<script setup>
import FileUpload from "../file-upload/FileUpload.vue";
import { ref, reactive, toRaw, onMounted} from "vue";
import { PlusOutlined } from "@ant-design/icons-vue";
import { QuillEditor} from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { ADDSUBPRODUCT } from "@/plugins/api";
import { message } from "ant-design-vue";
import {Select} from "ant-design-vue";

const props = defineProps(['product' , 'visible']);// eslint-disable-line
const emit = defineEmits(['closeDialog',"refresh"]);// eslint-disable-line


// const description = ref(null);
const modalFormRef = ref();
const modalFormState = reactive({
  name: "",
  unitPrice: "",
  imageUrl: "",
  fromImgUrl: "",
  description: null
});

import { useI18n } from "vue-i18n";

 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });


 const option = ref([
          {
          value: true,
          label: 'true'
          },
         {
          value: false,
          label: 'false'
          }
        ]);

    const handleChange = value => {
      console.log(`selected ${value}`);
    };



const onOk = ()  => {
  modalFormRef.value
    .validateFields()
    .then(async (values) => {
      console.log("Received values of form: ", values);
    
      // console.log('formState: ', toRaw(modalFormState));
      // modalFormRef.value.resetFields();
      // console.log('reset formState: ', toRaw(modalFormState));
      let productId = props.product.productId;
    let res=  await ADDSUBPRODUCT(productId,values.name,values.unitPrice,values.imageUrl,values.fromImgUrl,values.description)
    .then((res)=>{
      if(res.code==200){
        message.success(t('success'),0.4);
      }
    })
    .catch((err)=>{
      if(err.response.status==500){
        message.error(t('fail'),0.4);
      }
    })

      emit('closeDialog');
      emit('refresh');
    
    })
    .catch((info) => {
      console.log("Validate Failed:", info);
    });
};



function closeModal() {
  emit('closeDialog');
}

const  imageUrlLink= (value)=>{
  const link = value.link;
 modalFormState.imageUrl = link;
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
                ['link'  ],
              ],
              handlers: {
              },
            },
          },
          placeholder: t('editor_placeholder'),
          readOnly: false,
        };


//Custom Rules

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




onMounted(() => {
//  imageUrlLink();
  // 
  console.log(props.product);
})
</script>

<style>
</style>