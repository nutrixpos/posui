<template>
    <div class="w-full">
         <div class="grid mx-2">
             <div class="col-12 flex">
                 <div class="gird w-full">
                     <div class="col-12">
                        <h3>Settings</h3>
                    </div>
                    <div class="col-12 flex-column flex">
                        <h4>Inventory</h4>
                        <div class="flex align-items-center">
                            <span>default_inventory_quantity_warn</span>
                            <InputText class="ml-3" v-model.number="default_inventory_quantity_warn" type="number" />
                        </div>
                        
                        <Divider />
                        <h4 class="mb-2">Orders</h4>
                        <span class="mt-1">Queues</span>
                        <div class="flex align-items-center">
                            <div class="flex flex-column">
                                <div v-for="(queue,index) in order_queues" :key="index" class="flex align-items-center mt-2">
                                    <span>Prefix:</span>
                                    <InputText v-model="order_queues[index].prefix" class="mx-2" />
                                    <span>Next:</span>
                                    <InputText v-model="order_queues[index].next"  class="mx-2 "/>
                                    <Button severity="secondary" aria-label="Remove" icon="pi pi-times" @click="order_queues.splice(index,1)" />
                                </div>
                                <div class="flex align-items-center mt-3">
                                    <span>Prefix:</span>
                                    <InputText v-model="new_queue_prefix" class="mx-2" />
                                    <span>Next:</span>
                                    <InputText v-model.number="new_queue_next"  class="mx-2 "/>

                                    <Button label="Add" @click="order_queues.push({prefix:new_queue_prefix,next:new_queue_next}); new_queue_prefix = ''; new_queue_next = 1" />
                                </div>
                            </div>
                        </div>
                        <div class="mt-6">
                            <Button label="Save" @click="saveSettings()" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios'
import InputText from 'primevue/inputtext';
import Divider from 'primevue/divider';
import Button from 'primevue/button';
import { useToast } from "primevue/usetoast";
import {getCurrentInstance,ref} from 'vue'

const { proxy } = getCurrentInstance();

const default_inventory_quantity_warn = ref(0)
const order_queues = ref<any>({})

const new_queue_prefix = ref("")
const new_queue_next = ref(1)

const toast = useToast();

const saveSettings = () => {
    axios.post(`http://${process.env.VUE_APP_BACKEND_HOST}${process.env.VUE_APP_MODULE_CORE_API_PREFIX}/api/updatesettings`, 
        {
            inventory: {
                default_inventory_quantity_warn:default_inventory_quantity_warn.value
            },
            orders: {
                queues: order_queues.value
            }
        },
        {
            headers: {
                Authorization: `Bearer ${proxy.$zitadel.oidcAuth.accessToken}`
            }
        }
    )
    .then(()=>{
        toast.add({ severity: 'success', summary: 'Settings updated successfully!', detail: 'Done! ', life: 3000,group:'br' });
    })
    .catch((err) => {
        toast.add({ severity: 'error', summary: 'Failed', detail: 'Error updating settings !', life: 3000,group:'br' });  
        console.log(err)
    });
}

const getSettings = () => {
    axios.get(`http://${process.env.VUE_APP_BACKEND_HOST}${process.env.VUE_APP_MODULE_CORE_API_PREFIX}/api/getsettings`, {
        headers: {
            Authorization: `Bearer ${proxy.$zitadel.oidcAuth.accessToken}`
        },
    })
    .then((response)=>{
        console.log(response.data)
        default_inventory_quantity_warn.value = response.data.settings.inventory.default_inventory_quantity_warn
        order_queues.value = response.data.settings.orders.queues
    })
    .catch((err) => {
        console.log(err)
    });
}

getSettings()

</script>