import React, { useEffect, useState } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import '../services/util.service'
import { useWindowSize } from '../hooks/useWindowSize'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

export const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'כותרת',
      },
    },
}

export function YieldChart({rawData}) {
  const [yieldForecast, setYieldForcast] = useState() 
  const [chartData, setChartData] = useState() 
  const { screenWidth, screenHeight } = useWindowSize()
  const [chartKey, setChartKey] = useState(0)
  
  useEffect(() => {
    
    if (!rawData) {
        return
    }

    setYieldForcast((prevYieldForecast) => {
        const filteredData = rawData.filter(item => item.monthNo % 12 === 0).map(item => {
            return {
                ...item,
                yearNo: item.monthNo / 12
            }
        })
        
        return filteredData
    }) 
  }, [rawData]) 

  useEffect(() => {
    
    if (!yieldForecast) {
        return
    }

    setChartData({
        labels: yieldForecast.map(item => item.yearNo),
        datasets: [
          {
            label: 'תשואה על ההון',
            data: yieldForecast.map(item => {
                return item.returnOnEquity.fractionToFloatFormat(1)
            }),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'תשואה כוללת',
            data: yieldForecast.map(item => {
                return item.totalReturn.fractionToFloatFormat(1)
            }),
            borderColor: 'rgb(53, 162, 235)',
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
          },
        ],
    }) 
  }, [yieldForecast])

  useEffect(() => {
    
    if (!chartData || !screenWidth || !screenHeight) {
        return
    }
    
    setChartKey(prevKey => prevKey + 1)

  }, [screenWidth, screenHeight])
  
  if (!chartData) return <div>טוען</div>

  return <Line key={chartKey} options={options} data={chartData} />
}