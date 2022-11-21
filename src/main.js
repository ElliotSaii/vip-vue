import { createApp } from 'vue'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import router from './router'
import store from './store';

import VueDOMPurifyHTML from 'vue-dompurify-html';
import i18n from './i18n'



const app = createApp(App)
app.use(store)
app.use(router)
app.use(i18n)
app.use(Antd);

app.use(VueDOMPurifyHTML
    // , {
    // default: {
    //     ADD_TAGS: ['iframe'], // this one whitelists Youtube
    // },
    // }
)
app.mount('#app')
