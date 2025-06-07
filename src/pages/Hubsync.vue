<template>
     <div class="w-full">
        <div class="grid mx-2">
            <div class="col-12 flex">
                <div class="gird w-full">
                    <div class="col-12">
                        <h3>Hubsync</h3>
                    </div>
                    <div class="col-12">
                        <div class="col-12 lg:col-4 flex flex-column gap-2">
                            <label for="binary" class="font-bold">Enabled</label>
                            <ToggleSwitch v-model="hubSync.enabled" class="mb-2" />
                        </div>
                        <div class="col-12 lg:col-4 flex flex-column gap-2">
                            <label for="binary" class="font-bold">Server Host</label>
                            <InputText v-model="hubSync.serverHost" type="text" class="w-full mb-2" />
                        </div>
                        <div class="col-12 lg:col-4 flex flex-column gap-2">
                            <label for="binary" class="font-bold">Server Port</label>
                            <InputNumber v-model="hubSync.serverPort" mode="decimal" class="w-full mb-2" />
                        </div>
                        <div class="col-12 lg:col-4 flex flex-column gap-2">
                            <label for="binary" class="font-bold">Token</label>
                            <InputText v-model="hubSync.token" type="text" class="w-full mb-2" />
                        </div>
                        <div class="col-12 lg:col-4 flex flex-column gap-2">
                            <label for="binary" class="font-bold">Sync Interval (minutes)</label>
                            <InputText v-model="hubSync.syncInterval" type="text" class="w-full mb-2" />
                        </div>
                        <div class="col-12 lg:col-4 flex flex-column gap-2">
                            <label for="binary" class="font-bold">Buffer Size</label>
                            <InputNumber v-model="hubSync.bufferSize" mode="decimal" class="w-full mb-2" />
                        </div>
                        <div class="col-12 lg:col-4 flex flex-column gap-2">
                            <label for="binary" class="font-bold">Last Synced</label>
                            <span>{{ hubSync.lastSynced || "-" }}</span>
                        </div>
                        <div class="col-12 lg:col-4 flex flex-column gap-2">
                            <label for="binary" class="font-bold">Sync Progress</label>
                            <span>{{ hubSync.syncProgress || "-" }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {ref,getCurrentInstance} from 'vue'
import {InputText,ToggleSwitch, InputNumber} from 'primevue'
import axios from 'axios'
import { useToast } from "primevue/usetoast";
const { proxy } = getCurrentInstance();

const toast = useToast()

const hubSync = ref({
    enabled: false,
    serverHost: "",
    serverPort: 0,
    token: "",
    lastSynced: "",
    syncInterval: "",
    syncProgress: 0,
    bufferSize: 0,})



const save = () => {
    axios.post(`http://${import.meta.env.VITE_APP_BACKEND_HOST}${import.meta.env.VITE_APP_MODULE_CORE_API_PREFIX}/api/orders`, {
        data: hubSync.value
    },{
        headers: {
            Authorization: `Bearer ${proxy.$zitadel?.oidcAuth.accessToken}`
        }
    })
    .then(response => {
        toast.add({ severity: 'success', summary: 'Success', detail: 'Data saved successfully', life: 3000 });

    })
    .catch(error => {
        toast.add({ severity: 'error', summary: 'Error '+err.response.status, detail: err.response.data,group:'br' });
    });
}


</script>

<style scoped>
label {
    font-size:1rem;
    color: var(--p-button-text-primary-color)
}
</style>