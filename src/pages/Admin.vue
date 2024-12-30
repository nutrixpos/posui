<template>
    <div v-if="!loading">
        <div class="grid m-2">
            <div class="col-12">
                <Menubar :model="items">
                    <template #item="{ item }">
                        <router-link :to="item.link">
                            <Button :icon="item.icon" :label="$t(`${item.label.title}`,item.label.plural ? 3 : 1)"  text severity="secondary" />
                        </router-link>
                    </template>
                </Menubar>
            </div>
            <div class="col-2">
                <Tree v-model:expandedKeys="expandedKeys" :value="menu_tree" selectionMode="single" class="w-full">
                    <template #default="slotProps">
                        <RouterLink style="text-decoration: none;color: inherit;" :to="slotProps.node.link" class="flex align-items-center">
                            <div>{{ $t(`${slotProps.node.label.title}`,slotProps.node.label.plural ? 3 : 1) }}</div>
                        </RouterLink>
                    </template>
                </Tree>
            </div>
            <div class="col-10 flex pt-3">
                <RouterView />
            </div>
        </div>
    </div>
    <div style="width:100vw;height:100vh;display:flex;justify-content:center;align-items:center" v-if="loading">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="8" fill="transparent"
      animationDuration=".5s" aria-label="Custom ProgressSpinner" />
    </div>
</template>

<script setup>
import {ref,getCurrentInstance} from "vue";
import Menubar from 'primevue/menubar'
import Tree from "primevue/tree";
import Button from "primevue/button";
import { useI18n } from 'vue-i18n'
import { globalStore } from '@/store';
import axios from "axios";
import ProgressSpinner from "primevue/progressspinner";


const { proxy } = getCurrentInstance();
const store = globalStore()

// const selected_list_item = ref ({ name: 'Inventory', icon:'inbox', link:'inventory' })


const expandAll = () => {
    for (let node of menu_tree.value) {
        expandNode(node);
    }

    expandedKeys.value = { ...expandedKeys.value };
};

const expandNode = (node) => {
    if (node.children && node.children.length) {
        expandedKeys.value[node.key] = true;

        for (let child of node.children) {
            expandNode(child);
        }
    }
};

const expandedKeys = ref({});

const menu_tree =ref([
    {
        key: '0',
        label: {
            title:'inventory',
            plural: false,
        },
        data: 'Inventory',
        icon: 'pi pi-fw pi-inbox',
        link:'/admin/inventory',
    },
    {
        key: '1',
        label: {
            title: 'product',
            plural: true
        },
        data: 'Products',
        icon: 'pi pi-fw pi-barcode',
        link:'/admin/products',
    },
    {
        key: '2',
        label: {
            title:'category',
            plural: true
        },
        data: 'Categories',
        icon: 'pi pi-fw pi-sitemap',
        link:'/admin/categories',
    },
    {
        key: '3',
        label: {
            title :'order',
            plural:true
        },
        data: 'Orders',
        icon: 'pi pi-fw pi-box',
        link:'/admin/orders',
        children: [
            {
                key: '3-0',
                label: {
                    title:'list',
                    plural:false
                },
                data: 'List oders',
                icon: 'pi pi-fw pi-list',
                link:'/admin/orders',
            },
        ]
    },
    {
        key: '4',
        label: {
            title:'report',
            plural:true
        },
        data: 'Reports',
        icon: 'pi pi-fw pi-chart-line',
        link:'/admin/sales',
        children: [
            {
                key: '4-0',
                label: {
                    title:'sales',
                    plural:false
                },
                data: 'Sales',
                icon: 'pi pi-fw pi-percentage',
                link:'/admin/sales',
            },
        ]
    },
    {
        key: '5',
        label: {
            title:'settings',
            plural:false
        },
        data: 'Settings',
        icon: 'pi pi-fw pi-cog',
        link:'/admin/settings',
    },
    
])

const items = ref([
      {
          label: {
              title:'cashier',
              plural:false
          },
          icon: 'pi pi-home',
          link: '/home',
      },
      {
          label: {
              title:'kitchen',
              plural:false
          },
          icon: 'pi pi-star',
          link:'/kitchen'
      },
      {
          label: {
              title:'admin',
              plural:false
          },
          icon: 'pi pi-cog',
          link: '/admin',
      }
  ]);

  const loading = ref(true)
const { locale,setLocaleMessage } = useI18n({ useScope: 'global' })

const loadLanguage = async () => {

    await axios.get(`http://${process.env.VUE_APP_BACKEND_HOST}${process.env.VUE_APP_MODULE_CORE_API_PREFIX}/api/settings`, {
        headers: {
            Authorization: `Bearer ${proxy.$zitadel.oidcAuth.accessToken}`
        },
    })
    .then(async (response)=>{
        await axios.get(`http://${process.env.VUE_APP_BACKEND_HOST}${process.env.VUE_APP_MODULE_CORE_API_PREFIX}/api/languages/${response.data.data.language.code}`, {
            headers: {
                Authorization: `Bearer ${proxy.$zitadel.oidcAuth.accessToken}`
            }
        })
        .then(response2 => {

            setLocaleMessage(response2.data.data.code, response2.data.data.pack);
            locale.value = response2.data.data.code
            store.setOrientation(response2.data.data.orientation)
            loading.value = false
        })
        .catch((err) => {
            console.log(err)
        });
        loading.value = false
    })
    .catch((err) => {
        console.log(err)
    });

}


loadLanguage()
expandAll()
</script>

<style scoped>
* {
    font-size:1.2rem
}
</style>