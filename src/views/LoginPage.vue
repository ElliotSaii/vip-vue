<template>
<div id="form">

                <!-- <h1 :style="{margin: 'auto' , padding: '200px'}">VIP</h1> -->
<a-form ref="formRef" name="custom-validation"  class="register-form" :model="formState" :rules="rules"  v-bind="layout"  layout="vertical"
      @finish="handleFinish" :style="{width: '60%', padding: '200px',margin: 'auto'}"  >    

          <a-form-item has-feedback :label="t('email')" name="email">
             <a-input v-model:value="formState.email" :placeholder="t('input_email')" />
          </a-form-item>

          <a-form-item has-feedback :label="t('password')" name="pass">
             <a-input v-model:value="formState.pass" type="password" autocomplete="off" :placeholder="t('input_password')" />
          </a-form-item>

         <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" html-type="submit" >Submit</a-button>
            <a-button style="margin-left: 10px" @click="resetForm">Clear</a-button>
         </a-form-item>
 </a-form>


  </div>
</template>
<script setup>
import {message} from 'ant-design-vue'
import {  onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { LOGIN } from '../plugins/api';


    const formRef = ref();
    const formState = reactive({
      pass: '',
      email: '',
    });

    import {useI18n} from 'vue-i18n';
 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });


    const router = useRouter();

    let checkEmail = async (_rule, value) => {
      if (value==='') {
        return Promise.reject(t('error_input_email'));
      } else{
        return Promise.resolve();
      }
    
    };

    let validatePass = async (_rule, value) => {
      if (value === '') {
        return Promise.reject(t('error_password'));
      } else {
        return Promise.resolve();
      }
    };

    const handleFinish = async value => {
          formRef.value
          .validateFields()
          .then(async(values)=>{
           
            let res = await LOGIN(values.email, values.pass);
                if(res.code==200){
                  let token = res.obj.token;
                  localStorage.setItem("token",token);
                 
                  location.reload()
                   message.success(t('success'),0.5);
           
                 
                }else{
                  message.error(t('fail'),0.5);
                }
                 

                 
               
          }).catch((info)=>{
            console.log("Validated Failed: ",info);
          })
       
      
        
    };
    onMounted(()=>{
         const token = localStorage.getItem("token");
           if(token==null){
            router.push("/login")
           }else{

             router.push("/realname")
           }
    })

        const resetForm = () => {
          formRef.value.resetFields();
        };

    const rules = {
      pass: [{
        required: true,
        validator: validatePass,
        trigger: 'change',
      }],
   
      email: [{
        validator: checkEmail,
        trigger: 'change',
      }],
    };
    const layout = {
      labelCol: {
        span: 4,
      },
      wrapperCol: {
        span: 14,
      },
    };


</script>
<style scoped>

</style>