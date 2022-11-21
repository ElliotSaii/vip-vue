import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginPage.vue'),
  },
 
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: ()=>import('../views/404Page.vue')
  },
  {
    path: '/',
    name: 'MainLayout',
    redirect: '/realname',
    component: () => import('../components/MainLayout.vue'),
    children: [
      {
        path: '/realname',
        name: 'realname',
        component: () => import('../user/RealNameList.vue'),
        beforeRouteEnter: (to, from, next) => {
          // 
          const token = localStorage.getItem('token');
          console.log("====="+token);
          
          if (token == null) {
            next('/login');
          }
          next();
        },
      },
      {
        path: '/member-list',
        name: 'Member List',
        component: () => import('../member/MemberList.vue')
      },

      {
      path: '/product-list',
        name: 'ProductList',
      component: ()=> import('../products/ProductList.vue')
    },
      {
      path: '/order-list',
        name: 'Order List',
        component: () => import('../orders/OrderList.vue')
    },
      {
      path: '/withdraw-list',
        name: 'Withdraw List',
        component: () => import('../withdraw/WithdrawList.vue')
    },
      {
      path: '/honor-list',
        name: 'Honor List',
        component: () => import('../honors/HonorList.vue')
    },
      {
      path: '/banner-list',
        name: 'Banner List',
        component: () => import('../banner/BannerList.vue')
    },
      {
      path: '/guide-list',
        name: 'Guide List',
        component: () => import('../guide/GuideList.vue')
    },
      {
      path: '/app-version',
        name: 'Application',
        component: () => import('../components/AppVersion.vue')
    },
      
      {
      path: '/bank-list',
        name: 'Bank List',
        component: () => import('../banks/BankList.vue')
    },
      
      {
      path: '/test',
        name: 'Test Center',
        component: () => import('../components/TestCenter.vue')
    },
      
      

      ]
  }
]

const router = createRouter({
  // history: createWebHistory(process.env.BASE_URL),
  // history: createWebHistory(),
  history: createWebHashHistory(),
  routes
})


export default router
