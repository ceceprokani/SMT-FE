<template>
    <Line :data="chartData" :options="chartOptions" />
  </template>
  
  <script>
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale
  } from 'chart.js'
  
  import { Line } from 'vue-chartjs'
  
  // Register chart.js components
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale
  )
  
  export default {
    name: 'LineChart',
    props: {
        chartData: Object
    },
    components: {
      Line
    },
    data() {
      return {
        chartOptions: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            title: {
              display: false,
              text: 'Line Chart Interpolation Mode'
            }
          },
          interaction: {
            mode: 'index',
            intersect: false
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      }
    }
  }
  </script>