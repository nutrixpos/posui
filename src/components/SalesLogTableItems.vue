<template>
    <DataTable v-model:expandedRows="expandedSalesLogOrderItemComponents" :value="props.items">
        <Column expander style="width: 5rem" />
        <Column sortable field="ItemName" :header="$t('name')">
            <template #body="slotProps">
                <Badge value="REFUNDED" v-if="items_refunds[slotProps.data.item_id]" severity="danger"  />
                {{ slotProps.data.ItemName }}
            </template>
        </Column>
        <Column sortable field="Cost" :header="$t('cost')"></Column>
        <Column sortable field="Quantity" :header="$t('quantity')">
            <template #body="slotProps">
                <div>{{ slotProps.data.Quantity != "0" ? slotProps.data.Quantity : "1" }}</div>
            </template></Column>
        <Column sortable field="SalePrice" :header="$t('sale_price')"></Column>
        <Column sortable field="profit" :header="$t('profit')">
            <template #body="slotProps">
                <div :style="`${ (slotProps.data.SalePrice - slotProps.data.Cost) > 0 ? 'color:green' : 'color:red' }`">{{ slotProps.data.SalePrice - slotProps.data.Cost }}</div>
            </template>
        </Column>
        <template #expansion="slotProps">
            <DataTable :value="slotProps.data.Components">
                <Column sortable field="ComponentName" :header="$t('name')"></Column>
                <Column sortable field="Cost" :header="$t('cost')"></Column>
                <Column sortable field="Quantity" :header="$t('quantity')"></Column>
                <Column sortable field="EntryId" :header="$t('entry')"></Column>
            </DataTable>
            <SalesLogTableItems v-if="slotProps.data.DownstreamCost != null" :items="slotProps.data.DownstreamCost" />    
        </template>
    </DataTable>
</template>

<script setup lang="ts">

import {defineProps,ref} from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import {Badge} from 'primevue';

const props = defineProps(['items','order_refunds'])
const expandedSalesLogOrderItemComponents = ref([])


const items_refunds = ref({})

const init = () => {
    props.items.forEach((item) => {
        props.order_refunds.forEach((order_refund) => {

            if (order_refund.order_item_id == item.item_id){
                if (!items_refunds.value[item.item_id]) {
                    items_refunds.value[item.item_id] = {
                        is_refunded: true,
                        refund_amount: order_refund.amount,
                        refund_reason: order_refund.reason
                    }
                    return
                }
                items_refunds.value[item.item_id].refund_amount += order_refund.amount
                items_refunds.value[item.item_id].refund_reason = order_refund.reason
            }
        })
    })
}

init()

</script>