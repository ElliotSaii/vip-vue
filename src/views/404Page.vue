<template>
  <a-result status="404" title="404" :sub-title="t('404_page')">
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
