<template>
    <div>
        <div class="grid m-2">
            <div class="col-12">
                <Menubar :model="items">
                    <template #item="{ item, props }">
                        <a class="flex align-items-center" v-bind="props.action" :href="item.link">
                            <span :class="item.icon" />
                            <span class="ml-2">{{ item.label }}</span>
                        </a>
                    </template>
                </Menubar>
            </div>
            <div class="col-2">
                <Tree v-model:expandedKeys="expandedKeys" :value="menu_tree" selectionMode="single" class="w-full">
                    <template #default="slotProps">
                        <RouterLink style="text-decoration: none;color: inherit" :to="slotProps.node.link" class="flex align-items-center">
                            <div>{{ slotProps.node.label }}</div>
                        </RouterLink>
                    </template>
                </Tree>
            </div>
            <div class="col-10 flex pt-3">
                <RouterView />
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref} from "vue";
import Menubar from 'primevue/menubar'
import Tree from "primevue/tree";

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
        label: 'Inventory',
        data: 'Inventory',
        icon: 'pi pi-fw pi-inbox',
        link:'/admin/inventory',
    },
    {
        key: '1',
        label: 'Products',
        data: 'Products',
        icon: 'pi pi-fw pi-barcode',
        link:'/admin/products',
    },
    {
        key: '2',
        label: 'Categories',
        data: 'Categories',
        icon: 'pi pi-fw pi-sitemap',
        link:'/admin/categories',
    },
    {
        key: '3',
        label: 'Orders',
        data: 'Orders',
        icon: 'pi pi-fw pi-box',
        link:'/admin/orders',
        children: [
            {
                key: '3-0',
                label: 'List',
                data: 'List oders',
                icon: 'pi pi-fw pi-list',
                link:'/admin/orders',
            },
        ]
    },
    {
        key: '4',
        label: 'Reports',
        data: 'Reports',
        icon: 'pi pi-fw pi-chart-line',
        link:'/admin/sales',
        children: [
            {
                key: '4-0',
                label: 'Sales',
                data: 'Sales',
                icon: 'pi pi-fw pi-percentage',
                link:'/admin/sales',
            },
        ]
    },
    {
        key: '5',
        label: 'Settings',
        data: 'Settings',
        icon: 'pi pi-fw pi-cog',
        link:'/admin/settings',
    }
])

const items = ref([
      {
          label: 'Cashier',
          icon: 'pi pi-home',
          link: '/home',
      },
      {
          label: 'Kitchen',
          icon: 'pi pi-star',
          link:'/kitchen'
      },
      {
          label: 'Admin',
          icon: 'pi pi-cog',
          link: '/admin',
      }
  ]);

expandAll()
</script>