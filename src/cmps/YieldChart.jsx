import { useEffect, useState } from 'react'
import {Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
import '../services/util.service'
import { useWindowSize } from '../hooks/useWindowSize'
import PropTypes from "prop-types"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)
export function YieldChart({rawData}) {
  const [fontSize, setFontSize] = useState(14)
  const [chartHeight, setChartHeight] = useState(300)
  const [yieldForecast, setYieldForcast] = useState() 
  const [chartData, setChartData] = useState() 
  const [chartKey, setChartKey] = useState(0)
  const { screenWidth, screenHeight } = useWindowSize()
  
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: fontSize,
          },
        },
      },
      title: {
        display: false,
        text: 'כותרת',
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: fontSize,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: fontSize,
          },
        },
      },
    },
  }

  useEffect(() => {
    

    const updateFontSize = () => {
      const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
      const baseFont = 16
      
      const zoomRatio = rootFontSize / baseFont
      const scaledFont = Math.min(14 * zoomRatio, 26)
      
      setFontSize(scaledFont)
      setChartHeight(100 * zoomRatio) 
    }
  
    updateFontSize() 
  
    const observer = new ResizeObserver(updateFontSize)
    observer.observe(document.documentElement)
  
    return () => observer.disconnect()
  }, [])
  
  useEffect(() => {
    
    if (!rawData) {
        return
    }

    setYieldForcast(() => {
      if (!rawData) return []
    
      return rawData
        .filter(item => item.monthNo % 12 === 0)
        .map(item => ({
          ...item,
          yearNo: item.monthNo / 12,
        }))
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
                return item.returnOnEquity?.fractionToFloatFormat(1)
            }),
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
          {
            label: 'תשואה כוללת',
            data: yieldForecast.map(item => {
                return item.totalReturn?.fractionToFloatFormat(1)
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

  return <Line key={chartKey} options={options} data={chartData} height={chartHeight}  />
}


YieldChart.propTypes = {
  rawData: PropTypes.arrayOf(
    PropTypes.shape({
      monthNo: PropTypes.number.isRequired,
      returnOnEquity: PropTypes.number,
      totalReturn: PropTypes.number
    })
  )
}