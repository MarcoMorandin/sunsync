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

export const chartData = async (color, endpoint, year, aggregation, pv_id) => {
  const labels = []
  const dataset = []
  let params = {}
  if(year !== '' && year)
    params.year = year
  if(aggregation !== '' && aggregation)
    params.aggregation = aggregation
  if(pv_id !== '' && pv_id)
    params.pv_id = pv_id

  await axios.get(endpoint, {
    headers: {"Authorization" : `Bearer ${authStore.getToken.value}`},
    params: params
  })
    .then((response) => {
      response.data.forEach(pvData => {
        pvData.time = new Date(pvData._id.year + "-" + pvData._id.month + "-" + pvData._id.day)
        labels.push(pvData.time.toISOString().split('T')[0])
        dataset.push(pvData.total)
      });
    })
    .catch((error) => {
      console.log(error)
    })
  
  return {
    labels,
    datasets: [
      datasetObject(color, dataset)
    ]
  }
}
