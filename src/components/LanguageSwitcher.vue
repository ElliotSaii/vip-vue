
<template>
  <select v-model="$i18n.locale" class="switchBtn" @change="switchLang">
    <option v-for="(locale, i) in locales" :key="`locale-${i}`" :value="locale">
     {{ locale }}
    </option>
  </select>
</template>

<script>
export default {
  name: "LocaleSwitcher",
  data() {
    return { 
      lang: this.$i18n.locale,
      locales: ["cn", "en"] 
    };
  },

  setup() {
    const switchLang = (e) => {
      // this.$i18n.locale = e.target.value;
      localStorage.setItem('lang', e.target.value);
    }

    return {
      switchLang
    }
  }
};
</script>

<style scoped>
.switchBtn{
  width: 50px;
  height: 24px;
  outline: none;
 
}

</style>