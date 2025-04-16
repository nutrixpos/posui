<template>
    <div>
        <DataTable  v-model:expandedRows="expandedRows" :value="props.order.items" stripedRows tableStyle="width: 50rem" class="w-full pr-5">
            <Column expander style="width: 5rem" />
            <Column field="product.name" :header="$t('name')"></Column>
            <Column field="price" :header="$t('price')"></Column>
            <Column field="quantity" :header="$t('quantity')"></Column>
            <Column field="status" :header="$t('status')"></Column>
            <Column :header="$t('actions')">
                <template #body="slotProps">
                    <ButtonGroup>
                        <Button icon="pi pi-book" severity="secondary" @click="itemToDisplay=slotProps.data; item_details_dialog=true" />
                        <Button icon="pi pi-undo" :label="$t('return')" severity="warn" aria-label="refund" @click="itemToRefund=slotProps.data;item_refund_dialog=true;">
                            <span class="pi pi-undo"></span>
                            <div>return</div>
                        </Button>
                    </ButtonGroup>
                </template>
            </Column>
            <template #expansion="slotProps">
                <h4>{{ $t('material',3) }}</h4>
                <DataTable :value="slotProps.data.materials">
                    <Column field="material.name" :header="$t('name')"></Column>
                    <Column field="quantity" :header="$t('quantity')"></Column>
                    <Column field="material.unit" :header="$t('unit')"></Column>
                </DataTable>
            </template>
        </DataTable>
        <Dialog v-model:visible="item_details_dialog" modal header="Item Details" :style="{ width: '75rem' }" :breakpoints="{ '1199px': '50vw', '575px': '90vw' }">
            <pre>
                {{ itemToDisplay  }}
            </pre>
        </Dialog>
        <Dialog v-model:visible="item_refund_dialog" modal :header="`Returning ${itemToRefund?.product.name} | order #${props.order.display_id}`" :style="{ width: '75rem' }" :breakpoints="{ '1199px': '50vw', '575px': '90vw' }">
            <OrderItemRefund :item="itemToRefund" :order="props.order" />
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import Dialog from 'primevue/dialog';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import { ref,defineProps } from 'vue';
import { OrderItem } from '@/classes/OrderItem';
import Button from 'primevue/button';
import ButtonGroup from 'primevue/buttongroup';
import OrderItemRefund from './OrderItemRefund.vue';
import Order from '@/classes/Order';

const expandedRows = ref([]);
const itemToDisplay = ref<OrderItem>()
const itemToRefund = ref<OrderItem>()
const item_details_dialog = ref(false)
const item_refund_dialog = ref(false)

const props = defineProps({
    order: {
        type: Order,
        required: true
    },
})


</script>