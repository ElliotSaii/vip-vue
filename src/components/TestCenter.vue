<template>
  
  <a-config-provider :locale="locale === 'en' ? enUS : zhCN">

      
    
 
        <a-range-picker v-model="locale" style="width: 200px" />
     
      

  </a-config-provider>
</template>
<script setup>
import { Modal } from 'ant-design-vue';
import enUS from 'ant-design-vue/es/locale/en_US';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { defineComponent, ref, watch } from 'vue';
dayjs.locale('en');


    const locale = ref(localStorage.getItem('lang'));
    watch(locale, val => {
      dayjs.locale(val);
    });
    
    


</script>
<style scoped>

</style>