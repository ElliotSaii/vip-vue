<template>
<div id="form">
<h1 id="logo">VIP</h1>

  <a-form
    ref="formRef"
    name="custom-validation"
    class="register-form"
    :model="formState"
    :rules="rules"
    v-bind="layout"
    @finish="handleFinish"
    @validate="handleValidate"
    @finishFailed="handleFinishFailed"
    
  >    

    <a-form-item has-feedback label="email" name="email">
      <a-input v-model:value="formState.email" />
    </a-form-item>

    <a-form-item has-feedback label="Password" name="pass">
      <a-input v-model:value="formState.pass" type="password" autocomplete="off" />
    </a-form-item>
    <a-form-item has-feedback label="Confirm" name="checkPass">
      <a-input v-model:value="formState.checkPass" type="password" autocomplete="off" />
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
      <a-button type="primary" html-type="submit">Submit</a-button>
      <a-button style="margin-left: 10px" @click="resetForm">Clear</a-button>
    </a-form-item>
  </a-form>


  </div>
</template>
<script>
import { defineComponent, reactive, ref } from 'vue';
import { LOGIN } from '../plugins/api';
export default defineComponent({
  setup() {
    const formRef = ref();
    const formState = reactive({
      pass: '',
      checkPass: '',
      email: '',
    });

    let checkEmail = async (_rule, value) => {
      if (value==='') {
        return Promise.reject('Please input the email');
      } else{

        return Promise.resolve();
      }
    
    };

    let validatePass = async (_rule, value) => {
      if (value === '') {
        return Promise.reject('Please input the password');
      } else {
        if (formState.checkPass !== '') {
          formRef.value.validateFields('checkPass');
        }

        return Promise.resolve();
      }
    };

    let validatePass2 = async (_rule, value) => {
      if (value === '') {
        return Promise.reject('Please input the password again');
      } else if (value !== formState.pass) {
        return Promise.reject("Two inputs don't match!");
      } else {
        return Promise.resolve();
      }
    };

    const rules = {
      pass: [{
        required: true,
        validator: validatePass,
        trigger: 'change',
      }],
      checkPass: [{
        validator: validatePass2,
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

    const handleFinish = async values => {
      console.log(values, formState);

      var response = await LOGIN(formState.email, formState.pass);
      console.log(response);
    };

    const handleFinishFailed = errors => {
      console.log(errors);
    };

    const resetForm = () => {
      formRef.value.resetFields();
    };

    const handleValidate = (...args) => {
      console.log(args);
    };

    return {
      formState,
      formRef,
      rules,
      layout,
      handleFinishFailed,
      handleFinish,
      resetForm,
      handleValidate,
    };
  },

});
</script>
<style scoped>
#logo{
  margin-right: 60px;
  font-size: 4rem;
  padding: 2.7rem 0;
}
.register-form{
  width: 650px;
  /* background: pink; */
  margin: auto;
  /* padding-top: 10rem; */
}
#form{
  display: inline-block;
  align-items: center;
  /* background: #fff; */
}
</style>