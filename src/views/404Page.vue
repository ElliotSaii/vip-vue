<template>
  <a-result status="404" title="404" :sub-title="t('404_page')" id="container">
    <template #extra>
      <a-button type="primary">
       <router-link to="/"><BackwardFilled /> {{t('home')}} </router-link>
        </a-button>
    </template>
  </a-result>
</template>

<script setup>
import { BackwardFilled } from '@ant-design/icons-vue';

import { useI18n } from "vue-i18n";

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
