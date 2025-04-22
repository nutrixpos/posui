<template>
    <div class="w-full">
        <div class="grid mx-2">
            <div class="col-12 flex">
                <div class="gird w-full">
                    <div class="col-12">
                        <h3>{{$t('sales')}}</h3>
                    </div>
                    <div class="col-12 flex justify-content-center align-items-center w-full">
                        <div class="flex flex-column w-full">
                            <div class="grid">
                                <div class="col-8">
                                    <Card style="max-width:100%;">
                                        <template #content>
                                            <Line  v-if="chartData != undefined" style="min-height: 20rem;max-width:100%;" :chartData="chartData" :chartOptions="chartOptions" />
                                        </template>
                                    </Card>
                                </div>
                                <div class="col-4 flex justify-content-start align-items-start">
                                    <Card style="max-width:100%;">
                                        <template #content>
                                            <Pie style="max-width: 100%;" v-if="productPiechartData != undefined" :chartData="productPiechartData" :chartOptions="productPiechartOptions" />
                                        </template>
                                    </Card>
                                </div>
                            </div>
                            <DataTable @page="updatSalesTableRowsPerPage" :lazy="true" :totalRecords="salesTableTotalRecords" :loading="isSalesTableLoading" v-model:expandedRows="expandedSalesLogRows" paginatorPosition="both"  paginator :rows="salesTableRowsPerPage" :rowsPerPageOptions="[7, 14, 30, 90]" :value="sales_log" stripedRows tableStyle="min-width: 50rem;max-height:50vh;" class="w-full pr-2">
                                    <Column expander style="width: 5rem" />
                                    <Column sortable field="date" :header="$t('date')"></Column>
                                    <Column sortable field="costs" :header="$t('cost')"></Column>
                                    <Column sortable field="total_sales" :header="$t('sales')"></Column>
                                    <Column sortable field="profit" :header="$t('profit')">
                                        <template #body="slotProps">
                                            <div :style="`${ (slotProps.data.total_sales - slotProps.data.costs) > 0 ? 'color:green' : 'color:red' }`">{{ slotProps.data.total_sales - slotProps.data.costs }}</div>
                                        </template>
                                    </Column>
                                    <template #expansion="slotProps">
                                        <DataTable v-model:expandedRows="expandedSalesLogOrderItems" :value="slotProps.data.orders">
                                            <Column expander style="width: 5rem" />
                                            <Column sortable field="order.display_id" header="Id"></Column>
                                            <Column sortable field="order.submitted_at" header="Submitted At"></Column>
                                            <Column sortable field="order.cost" header="Cost"></Column>
                                            <Column sortable field="order.sale_price" header="Sales"></Column>
                                            <Column sortable field="profit" header="Profit">
                                                <template #body="slotProps">
                                                    <div :style="`${ (slotProps.data.order.sale_price - slotProps.data.order.cost) > 0 ? 'color:green' : 'color:red' }`">{{ slotProps.data.order.sale_price - slotProps.data.order.cost }}</div>
                                                </template>
                                            </Column>
                                            <template #expansion="slotProps">
                                                <SalesLogTableItems :items="slotProps.data.costs" />
                                            </template>
                                        </DataTable>
                                    </template>
                            </DataTable>
                        </div>                        
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import DataTable from "primevue/datatable";
import Column from 'primevue/column'
import {Line,Pie} from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,PointElement,LineElement,ArcElement} from 'chart.js'
import Card from "primevue/card";
import {getCurrentInstance, ref} from 'vue'
import axios from 'axios'
import SalesLogTableItems from '@/components/SalesLogTableItems.vue'
import { $dt } from '@primevue/themes';


ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale,PointElement,LineElement,ArcElement)


const {proxy} = getCurrentInstance()

const sales_log = ref([])
const expandedSalesLogRows = ref([])
const expandedSalesLogOrderItems = ref([])
const salesTableRowsPerPage = ref(7)
const salesTableFirstIndex = ref(0)
const salesTableTotalRecords = ref(0)


const chartData = ref();
const chartOptions = ref();


const chartLabels = ref([])
const chartSales = ref([])
const chartCost = ref([])

const isSalesTableLoading = ref(true)




const productPiechartData = ref();
const productPiechartOptions = ref();
const productPieChartLabels = ref([])
const productPieChartSales = ref([])


const updatSalesTableRowsPerPage = (event) => {
    const { first, rows } = event;
    loadSales(first,rows)
}


const setProductPieChartData = () => {
    return {
        labels: productPieChartLabels.value,
        datasets: [
            {
                data: productPieChartSales.value,
                backgroundColor: [$dt('teal.500').value, $dt('sky.500').value, $dt('gray.500').value],
                hoverBackgroundColor: [$dt('teal.500').value, $dt('sky.500').value, $dt('gray.500').value]
            }
        ]
    };
};

const setProductPieChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-blue-500');

    return {
        plugins: {
            legend: {
                labels: {
                    usePointStyle: true,
                    color: textColor
                }
            }
        }
    };
};



        
const setChartData = () => {
    return {
        labels: chartLabels.value,
        datasets: [
            {
                label: 'Sales',
                data: chartSales.value,
                fill: false,
                tension: 0.4,
                borderColor: $dt('emerald.500').value,
            },
            {
                label: 'Cost',
                data: chartCost.value,
                fill: false,
                tension: 0.4,
                borderColor: $dt('amber.300').value,
            },
        ]
    };
};
const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const textColor = documentStyle.getPropertyValue('--text-color');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.6,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
}


const loadSales = (first=salesTableFirstIndex.value,rows=salesTableRowsPerPage.value) => {


    let page_number = Math.floor(first/rows) + 1


    axios.get(`http://${process.env.VUE_APP_BACKEND_HOST}${process.env.VUE_APP_MODULE_CORE_API_PREFIX}/api/logs/salesperday?page[number]=${page_number}&page[size]=${rows}`, {
        headers: {
            Authorization: `Bearer ${proxy.$zitadel?.oidcAuth.accessToken}`
        }
    })
    .then(response => {

        let temp_sales_log = []
        chartLabels.value = []
        chartCost.value = []
        chartSales.value = []
        productPieChartLabels.value = []
        productPieChartSales.value = []
        isSalesTableLoading.value = true

        salesTableTotalRecords.value = response.data.meta.total_records


        for (let i=0;i<response.data.data.length;i++){
            chartLabels.value.push(response.data.data[i].date)
            temp_sales_log.push(response.data.data[i])
            chartSales.value.push(response.data.data[i].total_sales)
            chartCost.value.push(response.data.data[i].costs)

            for (let j=0;j<response.data.data[i].orders.length;j++){



                for (let k=0;k<response.data.data[i].orders[j].order.items.length;k++){

                    if (!productPieChartLabels.value.includes(response.data.data[i].orders[j].order.items[k].product.name)){
                        productPieChartLabels.value.push(response.data.data[i].orders[j].order.items[k].product.name)
                        productPieChartSales.value.push(response.data.data[i].orders[j].order.items[k].quantity)
                    }else {

                        let index = productPieChartLabels.value.indexOf(response.data.data[i].orders[j].order.items[k].product.name)
                        productPieChartSales.value[index] += response.data.data[i].orders[j].order.items[k].quantity
                    }   
                }
                
            }
        }

        sales_log.value = temp_sales_log


        chartData.value = setChartData();
        chartOptions.value = setChartOptions();


        productPiechartData.value = setProductPieChartData();
        productPiechartOptions.value = setProductPieChartOptions();



        isSalesTableLoading.value = false

    })
    .catch(error => {
        console.log(error)
    })

}

loadSales()
</script>