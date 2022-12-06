<template>
  <a-layout>

    <a-layout-header class="header" >
      <div class="logo" >
   
        <a-dropdown :placement="placement" >
           <a-avatar src="../../avatarpng.png" class="profile" />
                 <template #overlay>
                  <a-menu>
                    <!-- <a-menu-divider /> -->
                    <a-menu-item key="1">
                      <a @click="logout()"> {{ $t('logout') }} </a>
                    </a-menu-item>
                  </a-menu>
                </template>
        </a-dropdown>
     <LanguageSwitcher  class="profile" :style="{margin: '21px'}" />
  
      </div>
    </a-layout-header>

    <a-layout>

      <a-layout-sider width="200" style="background: #fff">
        <a-menu
          v-model:selectedKeys="selectedKeys"
          v-model:openKeys="openKeys"
          mode="inline"
          :style="{ height: '100%', borderRight: 0 }"
        >
          <a-sub-menu v-for="nav in navs" :key="nav.key">
            <template #title>

              <span>
                 <UsergroupAddOutlined v-if="nav.key=='sub1'" />
                <SearchOutlined v-if="nav.key=='sub2'" />
                <SettingOutlined v-if="nav.key=='sub3'" />
                <OrderedListOutlined v-if="nav.key=='sub4'" />
                <AppstoreOutlined v-if="nav.key=='sub5'" /> 
    
                {{nav.title}}
              </span>
            </template>
            <a-menu-item v-for="sub in nav.subs" :key="sub.key">
              <div @click="switchNav(sub.path, sub.key, nav.key)">
                {{ sub.title }}
              </div>
            </a-menu-item>
           
          </a-sub-menu>
        </a-menu>
      </a-layout-sider>

      <a-layout style="padding: 0 24px 24px">
        <a-layout-content
          :style="{ background: '#fff', padding: '24px', margin: 0, minHeight: '849px' }"
        >
          <RouterView />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script setup>
import { LaptopOutlined, NotificationOutlined,UsergroupAddOutlined ,OrderedListOutlined,} from '@ant-design/icons-vue';
import { computed, defineComponent, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {SettingOutlined,SearchOutlined,FieldNumberOutlined,AppstoreOutlined} from '@ant-design/icons-vue';

import LanguageSwitcher from '../components/LanguageSwitcher.vue'
import {useI18n} from 'vue-i18n'

const {t}= useI18n({
  inheritLocale: true,
  useScope: 'local'
})


const route = useRoute();
const router = useRouter();

const selectedKeys = ref(['1']);
const collapsed = ref(false);
const openKeys = ref(['sub1']);
const visible = ref(true);

const placement= ref('topRight');


const navs = computed(function () {

  return [{
      title: t('user_mgmt'),
      key: 'sub1',
      subs: [
        {title: t('real_name_list'), path: '/realname', key: '1'},
        {title:  t('member_list'), path: '/member-list', key: '2'},
      ]
    },
    {
      title: t('product_mgmt'),
      key: 'sub2',
      subs: [
        {title: t('product_list'), path: '/product-list', key: '3'}
      ]
    },
    {
      title: t('order_mgmt'),
      key: 'sub3',
      subs: [
        {title: t('order_list'), path: '/order-list', key: '4'}
      ]
    },
    {
      title: t('withdraw_mgmt'),
      key: 'sub4',
      subs: [
        {title: t('withdraw_list'), path: '/withdraw-list', key: '5'},
        {title: t('bank_list'), path: '/bank-list', key: '6'},
      ]
    },
    {
      title: t('app_info'),
      key: 'sub5',
      subs: [
        {title: t('honor_list'), path: '/honor-list', key: '7'},
        {title: t('banner_list'), path: '/banner-list', key: '8'},
        {title: t('guide_list'), path: '/guide-list', key: '9'},
        {title: t('app'), path: '/app-version', key: '10'},
      ]
    },
  ]
});

function switchNav(path, key, openKey) {
  selectedKeys.value.push(key);
  openKeys.value.push(openKey);
  router.push(path);
}

function changeNav() {

  switch (route.path) {
    case "/realname":
      selectedKeys.value = ['1'];
      openKeys.value = ['sub1'];
      break;
         
      case "/member-list":
      selectedKeys.value = ['2'];
      openKeys.value = ['sub1'];
      break;    

    case "/product-list":
      selectedKeys.value = ['3'];
      openKeys.value = ['sub2'];
      break;

    case "/order-list":
      selectedKeys.value = ['4'];
      openKeys.value = ['sub3'];
      break;  

    case "/withdraw-list":
      selectedKeys.value = ['5'];
      openKeys.value = ['sub4'];
      break;  

      case "/bank-list":
        selectedKeys.value=['6'];
        openKeys.value=['sub4'];
        break;

      case "/honor-list":
      selectedKeys.value = ['7'];
      openKeys.value = ['sub5'];
      break;  

      case "/banner-list":
        selectedKeys.value = ['8'];
        openKeys.value = ['sub5'];
        break;  
     

    


    case "/guide-list":
      selectedKeys.value = ['9'];
      openKeys.value = ['sub5'];
      break;  

    case "/app-version":
      selectedKeys.value = ['10'];
      openKeys.value = ['sub5'];
      break;  

     
  
    default:
      break;
  }
}
// Loading fail
router.onError((err)=>{
  const pattern = /Loading chunk (\d)+ failed/g;
  const isChunkLoadFailed =err.message.match(pattern);
  const targetPath= router.history.pending.fullPath;
  if(isChunkLoadFailed){
    router.replace(targetPath);
  }
})

const logout=()=>{
 localStorage.clear();
 window.location.reload();
}

onMounted(() => {
  changeNav();
})
</script>
<style>
#components-layout-demo-top-side-2 .logo {
  float: left;
  width: 120px;
  height: 31px;
  margin: 16px 24px 16px 0;
  background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
  float: right;
  margin: 16px 0 16px 24px;
}

.site-layout-background {
  background: #fff;
}
/* .header{
  display: flex;
  align-items: center;
} */
.profile{
  float: right;
  margin-top: 15px;
}
</style>