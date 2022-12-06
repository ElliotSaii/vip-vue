<template>
<div id="form">

<access-deny v-if="visible"> </access-deny>

<div  v-else>

<Particles
            id="tsparticles"
            :particlesInit="particlesInit"
            :particlesLoaded="particlesLoaded"
            :options="options"
        />
                <!-- <h1 :style="{margin: 'auto' , padding: '200px'}">VIP</h1> -->
<a-form ref="formRef" name="custom-validation"  class="register-form" :model="formState" :rules="rules"  v-bind="layout"  layout="vertical"
      @finish="handleFinish" :style="{width: '65%', padding: '300px',margin: ' auto 500px 10px'  }"  >    

          <a-form-item has-feedback :label="t('email')" name="email">
             <a-input v-model:value="formState.email" :placeholder="t('input_email')" />
          </a-form-item>

          <a-form-item has-feedback :label="t('password')" name="pass">
             <a-input v-model:value="formState.pass" type="password" autocomplete="off" :placeholder="t('input_password')" />
          </a-form-item>

         <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
            <a-button type="primary" html-type="submit" > {{t('login')}} </a-button>
            <a-button style="margin-left: 10px" @click="resetForm"> {{t('cls')}} </a-button>
         </a-form-item>
 </a-form>
</div>



  </div>
</template>
<script setup>
import AccessDeny from '../views/AccessDeny.vue'
import {message} from 'ant-design-vue'
import {  onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { LOGIN } from '../plugins/api';
import {useI18n} from 'vue-i18n';
import { loadFull } from "tsparticles";



const access_deny= ref()
const visible =ref(false)
    const formRef = ref();
    const formState = reactive({
      pass: '',
      email: '',
    });

    
 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });





const particlesInit = async (engine) => {
  await loadFull(engine);
};

const particlesLoaded = async (container) => {
  console.log("Particles container loaded", container);
};


          const options= {
          background: {
          color: {
          value: '#6698c4'
          }
          },
          fullScreen : {
          enable: true,
          zIndex: -1
          },

          fpsLimit: 120,
          interactivity: {
          events: {
          onClick: {
          enable: true,
          mode: 'push',
          },
          onHover: {
          enable: true,
          mode: 'grab',
          },
          resize: true,
          },
          modes: {
          bubble: {
          distance: 100,
          duration: 2,
          opacity: 0.8,
          size: 40,
          },
          push: {
          quantity: 4,
          },
          repulse: {
          distance: 200,
          duration: 0.4,
          },
          },
          },
          particles: {
          color: {
          value: '#fff',
          },
          links: {
          color: '#fff',
          distance: 150,
          enable: true,
          opacity: 0.5,
          width: 1,
          },
          collisions: {
          enable: true,
          },
          move: {
          direction: 'none',
          enable: true,
          outMode: 'bounce',
          random: false,
          speed: 2,
          straight: false,
          },
          number: {
          density: {
          enable: true,
          area: 400,
          },
          value: 10,
          },
          opacity: {
          value: 0.8,
          },
          shape: {
          type: 'circle',
          },
      
          size: {
          random: true,
          value: 3,
          },
          },
          detectRetina: false,
          }




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
           
            let response = await LOGIN(values.email, values.pass)
            .then((res)=>{
            
                if(res.code==200){
                  let token = res.obj.token;
                  localStorage.setItem("token",token);
                 
                  location.reload()
                   message.success(t('login_success'),0.5);
           
                 
                }else{
                  message.error(t('something_wrong'),0.5);
                }
                 
            }).catch((err)=>{
                  if(err.response.status==500){
                    visible.value=true;
                    access_deny.value=t("unable_to_login");
                  }
            })
                  
            
           
               
                

                 
               
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