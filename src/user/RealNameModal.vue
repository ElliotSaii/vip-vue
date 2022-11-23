<template>

  <a-modal
    title=""
    :visible="visible"
    @cancel="closeModal()"
    @ok="handleFinish"
    width="40%"
    :cancel-text="t('cancel_txt')"
      :ok-text="t('ok_txt')"
   
  >

<a-row  align="center" :gutter="8">
   <a-space :size="60" >
<a-col class="gutter-row" :span="6">

  <a-card :title="t('name')" :bordered="false" style="width: 220px">
     <p >{{userName}}</p>
  </a-card>  
  <!-- Face -->
</a-col>

<a-col class="gutter-row" :span="6">
  <a-card :title="t('face')" :bordered="false" style="width: 220px">
     <a-image width="180px" height="240px"
       :src="face"
      />
  </a-card>  
</a-col>
   </a-space>
</a-row>


<a-row align="center" :gutter="8">
  <a-space :size="60" >
  <a-col class="gutter-row" :span="6">
<!-- Front -->
<a-card :title="t('front')" :bordered="false" style="width: 220px">
     <a-image width="180px" height="240px"
       :src="front"
      />
  </a-card>    
  </a-col>
<a-col class="gutter-row" :span="6">
  <!-- Back -->
  <a-card :title="t('back')" :bordered="false" style="width: 220px">
     <a-image width="180px" height="240px"
       :src="back"
      />
  </a-card> 
</a-col>
  </a-space>   
</a-row>


<a-row style="margin: 10px 120px">
      <Select ref="select" v-model:value="formState.review"  @change="handleChange" style="width: 220px" select>
        <Select.Option :value="2" > {{t('success')}} </Select.Option >
        <Select.Option  :value="3">{{t('fail')}}</Select.Option >
        <Select.Option  :value="1"> {{t('pending')}} </Select.Option >
      </Select>
</a-row>
  
  </a-modal>
</template>

<script setup>
import {message} from 'ant-design-vue'
import {  reactive, ref,toRaw  , onMounted} from 'vue';
import {Select} from "ant-design-vue";
import { REALNAMEAUTH } from '@/plugins/api';


const emit = defineEmits(['closeDialog','refresh']);// eslint-disable-line
const props = defineProps(['realname','visible']);// eslint-disable-line
    
    const face = ref('');
    const front = ref('');
    const back = ref('');
    const userName = ref('');
    const memberId = ref();

    const formState = reactive({
      review: 2,
    });
    import { useI18n } from "vue-i18n";

 const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });


    // const option = ref([
    //       {
    //       value: 3,
    //       label: 'fail'
    //       },
    //      {
    //       value: 2,
    //       label: 'success'
    //       },
    //      {
    //       value: 1,
    //       label: 'pending'
    //       }
    //     ]);


    const handleChange = value => {
      console.log(`selected ${value}`);
    };

    const handleFinish =async value=>{
     memberId.value = props.realname.memberId

     const res= await REALNAMEAUTH(memberId.value,formState.review)
     .then((res)=>{
          if(res.code==200){
            message.success(t('success'),0.4);
          }
     }).catch((err)=>{
      if(err.response.status==500){
        message.error(t('fail'),0.4)
      }
     })       
           emit('refresh');
           emit('closeDialog');
  
    }

  function userInfo(){
     face.value = props.realname.face,
      front.value = props.realname.front,
      back.value = props.realname.back,
      userName.value = props.realname.username
  }

function closeModal() {
  emit('closeDialog');
}


  onMounted(()=>{
      userInfo();


      // console.log(props.realname);
  })


</script>

<style scoped>

</style>