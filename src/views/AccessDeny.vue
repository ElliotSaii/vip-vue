<template>
  <a-result status="403" :title="t('access_deny')" :sub-title="t('sorry_txt')" id="container">
   
  </a-result>
</template>

<script setup>
   import {useI18n} from 'vue-i18n';
  const { t } = useI18n({
      inheritLocale: true,
      useScope: "local"
    });

</script>

<style scoped>
#container{
background: #6698c4;
 width: 100%;
 height: 100%;
}
</style>