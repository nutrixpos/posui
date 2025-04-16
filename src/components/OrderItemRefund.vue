<template>
    <div class="flex flex-column">
        <div class="flex w-full flex-column">
            Money To refund
            <div class="flex w-full justify-content-start align-items-center">
                <Slider v-model="refund_value" :max="props.item.price" class="w-9 m-1 mx-2" style="height:0.6rem;" />
                <p class="ml-2" style="font-size:0.8rem">{{ refund_value.toFixed(2) }}</p>
            </div>
        </div>
        <div class="flex gap-4">
            {{ props.item.product.name }} Destination: 
            <div class="flex flex-wrap gap-4">
                <div class="flex items-center gap-2">
                    <RadioButton v-model="item_destination" inputId="option2" name="item_destination" value="inventory" />
                    <label for="option2">Inventory</label>
                </div>
                <div class="flex items-center gap-2">
                    <RadioButton v-model="item_destination" inputId="option1" name="item_destination" value="dispose" />
                    <label for="option1">Dispose</label>
                </div>
                <div class="flex items-center gap-2">
                    <RadioButton v-model="item_destination" inputId="option3" name="item_destination" value="waste" />
                    <label for="option3">Waste</label>
                </div>
                <div class="flex items-center gap-2">
                    <RadioButton v-model="item_destination" inputId="option4" name="item_destination" value="custom" />
                    <label for="option4">Custom (materials / products)</label>
                </div>
            </div>
        </div>
        <Divider />
        <Textarea v-model="reason" class="w-4" :placeholder="$t('reason')"/>
        <h3 v-if="item_destination == 'custom'">Materials</h3>
        <div  v-if="item_destination == 'custom'" class="flex flex-column">
            <div v-for="(material,index) in props.item.materials" :key="index" class="flex flex-column gap-2">
                <div class="flex gap-3 align-items-center">
                    <h4>{{ material.material.name }}</h4>
                    <h4>{{ material.quantity }}</h4>
                    <h4>{{ material.material.unit }}</h4>
                </div>
                <div class="flex align-items-center gap-2">
                    <label for="inventory_return_quantity">{{$t('inventory_return')}}</label>
                    <InputText v-model.number="materials_inventory_returns[index]" type="number" aria-describedby="inventory_return_quantity" />
                </div>
                <div class="flex align-items-center gap-2">
                    <label for="dispose">{{$t('dispose')}}</label>
                    <InputText v-model.number="material_disposals[index]" type="number" aria-describedby="dispose_quantity" />
                </div>
                <div class="flex align-items-center gap-2">
                    <label for="waste">{{$t('waste')}}</label>
                    <InputText v-model.number="materials_waste[index]" type="number" aria-describedby="waste_quantity" />
                </div>
            </div>
        </div>
        <Divider v-if="item_destination == 'custom'" />
        <div class="flex align-items-center gap-2" v-if="item_destination == 'custom'">
            <h3>Products</h3>
            <Button icon="pi pi-plus" size="small" severity="secondary" @click="pick_product_dialog=true"/>
        </div>
        <div class="flex flex-column gap-3">
            <div class="flex gap-4 align-items-center" v-for="(product,index) in products_to_add" :key="index">
                {{ product.name }}
                <div class="flex align-items-center gap-2">
                    <InputText v-model.number="added_products_quantities[index]" type="number" aria-describedby="added_product_quantity" />
                </div>
                <Button icon="pi pi-times" severity="secondary" @click="products_to_add.splice(index,1); added_products_quantities.splice(index,1)" />
            </div>
        </div>

        <Divider v-if="item_destination == 'custom'" />
        
        <div class="flex justify-content-end">
            <Button :label="$t('submit')" class="w-3" />
        </div>
    </div>
    <Dialog v-model:visible="pick_product_dialog">
        <PickProduct @returnProduct="(product) => products_to_add.push(product)" />
    </Dialog>
</template>

<script setup lang="ts">
import { defineProps,ref } from 'vue';
import { OrderItem, Product } from '@/classes/OrderItem';
import PickProduct from './PickProduct.vue';
import { Slider,RadioButton,Divider,InputText,Button,Dialog,Textarea } from 'primevue';

const refund_value = ref(0)

const reason = ref("")

const materials_inventory_returns = ref([])
const materials_waste = ref([])
const material_disposals = ref([])
const pick_product_dialog = ref(false)

const products_to_add = ref<Array<Product>>([])
const added_products_quantities = ref([])

const init = () => {
    refund_value.value = props.item.price
}


const item_destination = ref("inventory")

const props = defineProps({
    item: {
        type: OrderItem,
        required: true
    }
})

init()
</script>