export const chartColors = {
    default: {
        primary: '#00D1B2',
        info: '#209CEE',
        danger: '#FF3860',
        warning: '#EAB308'
    }
}

const datasetObject = (color, points, label='') => {
    return {
        fill: false,
        borderColor: chartColors.default[color],
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: chartColors.default[color],
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: chartColors.default[color],
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        data: points,
        tension: 0.5,
        cubicInterpolationMode: 'default',
        label: label
    }
}

const datasetObjectId = (color, points, label='', axisId='') => {
    return {
        fill: false,
        borderColor: chartColors.default[color],
        borderWidth: 2,
        borderDash: [],
        borderDashOffset: 0.0,
        pointBackgroundColor: chartColors.default[color],
        pointBorderColor: 'rgba(255,255,255,0)',
        pointHoverBackgroundColor: chartColors.default[color],
        pointBorderWidth: 20,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 15,
        data: points,
        tension: 0.5,
        cubicInterpolationMode: 'default',
        label: label,
        yAxisID: axisId
    }
}

import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

export const chartData = async (color, endpoint, year, aggregation, pv_id, series, label) => {
    const labels = []
    const dataset = []
    let params = {}
    if (year !== '' && year) params.year = year
    if (aggregation !== '' && aggregation) params.aggregation = aggregation
    if (pv_id !== '' && pv_id) params.pvinfo_id = pv_id

    await axios
        .get(endpoint, {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` },
            params: params
        })
        .then((response) => {
            response.data.forEach((pvData) => {
                if(pvData.hasOwnProperty('time')) {
                    labels.push(new Date(pvData.time).toISOString().split('T')[0])
                } else {
                    pvData.time = new Date(
                        pvData._id.year + '-' + pvData._id.month + '-' + pvData._id.day
                    )
                    labels.push(pvData.time.toISOString().split('T')[0])
                }
                dataset.push(pvData[series])
            })
        })
        .catch((error) => {
            console.log(error)
        })

    return {
        labels,
        datasets: [datasetObject(color, dataset, label)]
    }
}

export const chartDataArr = async (color, endpoint, year, aggregation, pv_id, series) => {
    const labels = []
    const dataset1 = []
    const dataset2 = []
    let params = {}
    if (year !== '' && year) params.year = year
    if (aggregation !== '' && aggregation) params.aggregation = aggregation
    if (pv_id !== '' && pv_id) params.pvinfo_id = pv_id

    await axios
        .get(endpoint, {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` },
            params: params
        })
        .then((response) => {
            response.data.forEach((pvData) => {
                if(pvData.hasOwnProperty('time')) {
                    labels.push(new Date(pvData.time).toISOString().split('T')[0])
                } else {
                    pvData.time = new Date(
                        pvData._id.year + '-' + pvData._id.month + '-' + pvData._id.day
                    )
                    labels.push(pvData.time.toISOString().split('T')[0])
                }
                dataset1.push(pvData[series[0]])
                dataset2.push(pvData[series[1]])
            })
        })
        .catch((error) => {
            console.log(error)
        })

    return {
        labels,
        datasets: [datasetObject(color[0], dataset1, 'Energy (Wh)'), datasetObject(color[1], dataset2, 'Energy Estimated (Wh)')]
    }
}

export const chartDataWsArr = async (color, endpoint, year, aggregation, ws_id, series) => {
    const labels = []
    const dataset1 = []
    const dataset2 = []
    let params = {}
    if (year !== '' && year) params.year = year
    if (aggregation !== '' && aggregation) params.aggregation = aggregation
    if (ws_id !== '' && ws_id) params.wsinfo_id = ws_id

    await axios
        .get(endpoint, {
            headers: { Authorization: `Bearer ${authStore.getToken.value}` },
            params: params
        })
        .then((response) => {
            response.data.forEach((pvData) => {
                if(pvData.hasOwnProperty('time')) {
                    labels.push(new Date(pvData.time).toISOString().split('T')[0])
                } else {
                    pvData.time = new Date(
                        pvData._id.year + '-' + pvData._id.month + '-' + pvData._id.day
                    )
                    labels.push(pvData.time.toISOString().split('T')[0])
                }
                dataset1.push(pvData[series[0]])
                dataset2.push(pvData[series[1]])
            })
        })
        .catch((error) => {
            console.log(error)
        })

    return {
        labels,
        datasets: [datasetObjectId(color[0], dataset1, 'Temperature (°C)', 'left-y-axis'), datasetObjectId(color[1], dataset2, 'Solar Power (Wh/m2)', 'right-y-axis')]
    }
}
