import { createApp } from 'vue'
import App from './App.vue'


import '@/assets/styles.scss'
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css'



import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';
import { createI18n } from 'vue-i18n'


// library.add(fas)



import {  createWebHistory, createRouter } from 'vue-router'

import Home from '@/pages/Home.vue'
import Kitchen from '@/pages/Kitchen.vue'
import Admin from '@/pages/Admin.vue'
import Inventory from '@/pages/Inventory.vue'
import Sales from '@/pages/Sales.vue'
import Products from '@/pages/Products.vue'
import Categories from '@/pages/Categories.vue'
import Orders from '@/pages/Orders.vue'
import { createPinia } from 'pinia'
import zitadelAuth from "@/services/zitadelAuth";
import Tooltip from 'primevue/tooltip';
import Settings from './pages/Settings.vue';


const routes = [
  {
    path: '/no-access', 
    component: ()=>{
        return import('@/pages/NoAccessView.vue')
    },
  },
  { 
    path: '/', alias:['/home'], 
    meta: {
      authName: zitadelAuth.oidcAuth.authName
    },
    component: () => {

      if (zitadelAuth.hasRole("admin") || zitadelAuth.hasRole("cashier") ) {
        return Home 
      }
      return import('@/pages/NoAccessView.vue')
    }
  },
  { 
    path: '/kitchen', component: () => {

      if (zitadelAuth.hasRole("admin") || zitadelAuth.hasRole("chef")) {
        return Kitchen
      }
      return import('@/pages/NoAccessView.vue')

    } 
  },
  { 
    path: '/admin', 
    component: () => {
      if (zitadelAuth.hasRole("admin")) {
        return Admin
      }
      return import('@/pages/NoAccessView.vue')
    },
    children: [
      {
        path: '',
        redirect: { path: '/admin/inventory' }
      },
      {path: 'inventory', component: Inventory,},
      {path: 'sales', component: Sales,},
      {path: 'products', component: Products,},
      {path: 'categories', component: Categories,},
      {path: 'orders',
      children:[
        {path: '', component: Orders,},
      ]},
      {path: 'settings', component: Settings,},
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

declare module 'vue' {
  interface ComponentCustomProperties {
      $zitadel: typeof zitadelAuth
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: {
      "cashier":"Cashier",
      "kitchen":"Kitchen",
      "admin":"Admin",
      "inventory":"Inventory",
      "product": "Product | Products",
      "order":"Order | Orders",
      "order_items":"Order Items",
      "total":"Total",
      "subtotal":"Subtotal",
      "discount":"Discount",
      "egp":"EGP",
      "search":"Search",
      "signout":"Signout",
      "notifications":"Notifications",
      "clear_all":"Clear All",
      "stashed_orders":"Stashed Orders",
      "chats":"Chats",
      "messages":"Messages",
      "write_message":"Write Message",
      "paylater_orders":"Paylater Orders",
      "checkout":"Checkout",
      "category":"Category | Categories",
      "add_component":"Add Component",
      "name":"Name",
      "quantity":"Quantity",
      "unit":"Unit",
      "status":"Status",
      "actions":"Actions",
      "history":"History",
      "list":"List",
      "report":"Report | Reports",
      "settings":"Settings",
      "language":"Language | Languages",
      "sales":"Sales"
    }
  }
})


zitadelAuth.oidcAuth.useRouter(router)

zitadelAuth.oidcAuth.startup().then(ok => {
  if (ok) {
        const app = createApp(App).use(createPinia())
        app.config.globalProperties.$zitadel = zitadelAuth

        app
        .use(router)
        .use(PrimeVue,{
            // Default theme configuration
            theme: {
                preset: Aura,
                options: {
                    prefix: 'p',
                    darkModeSelector: 'system',
                    cssLayer: false
                }
            }
        })
        .use(ToastService)
        .use(ConfirmationService)
        .use(i18n)
        .directive('tooltip', Tooltip)
        .mount('#app')
  } else {
      console.error('Zitadel startup was not ok')
  }
})

 