<script setup>
import { ref, watch, computed, onMounted, isProxy, toRaw } from 'vue'
import {
    Chart,
    LineElement,
    PointElement,
    LineController,
    LinearScale,
    CategoryScale,
    Tooltip,
    registerables
} from 'chart.js'
Chart.register(...registerables);

const props = defineProps({
    data: {
        type: Object,
        required: true
    },
    type: {
        type: String,
        default: 'pv'
    }
})

const root = ref(null)

let chart

Chart.register(LineElement, PointElement, LineController, LinearScale, CategoryScale, Tooltip)

onMounted(() => {
    let outChart = {}

    if(props.type == 'pv') {
        outChart = {
            type: 'line',
            data: toRaw(props.data),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        display: true,
                        ticks: {
                            min: 0
                        }
                    },
                    x: {
                        display: true
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        }
    } else if(props.type == 'ws') {
        outChart = {
            type: 'line',
            data: toRaw(props.data),
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    'left-y-axis': {
                        type: 'linear',
                        position: 'left',
                        title: {
                            display: true,
                            text: toRaw(props.data).datasets[0].label
                        }
                    },
                    'right-y-axis': {
                        type: 'linear',
                        position: 'right',
                        grid: {
                            color: 'rgba(0, 0, 0, 0)',
                        },
                        title: {
                            display: true,
                            text: toRaw(props.data).datasets[1].label
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: true
                    }
                }
            }
        }
    }
    
    chart = new Chart(root.value, outChart);
})

const chartData = computed(() => props.data)

watch(chartData, async (data) => {
    if (chart) {
        chart.data = data
        chart.update()
    }
})
</script>

<template>
    <canvas ref="root" />
</template>
