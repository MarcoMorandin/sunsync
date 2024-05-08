export const chartColors = {
  default: {
    primary: '#00D1B2',
    info: '#209CEE',
    danger: '#FF3860'
  }
}

const datasetObject = (color, points) => {
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
    pointRadius: 0,
    data: points,
    tension: 0.5,
    cubicInterpolationMode: 'default',
  }
}
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

export const chartData = async (endpoint, start_date, end_date, aggregation) => {
  const labels = []
  const dataset = []
  await axios.get(endpoint, {
    headers: {"Authorization" : `Bearer ${authStore.getToken.value}`},
    params: {
      startdate : start_date,
      enddate : end_date
    }
  })
    .then((response) => {
      response.data.forEach(pvData => {
        pvData.time = new Date(pvData.time)
        labels.push(pvData.time.toISOString().split('T')[0])
        dataset.push(pvData.power/1000)
      });
    })
    .catch((error) => {
      console.log(error)
    })
  
  return {
    labels,
    datasets: [
      datasetObject('info', dataset)
    ]
  }
}
