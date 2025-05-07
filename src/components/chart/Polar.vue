<template>
    <PolarArea :data="chartData" :options="chartOptions" />
  </template>
  
  <script>
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    ArcElement
  } from 'chart.js'
  
  import { PolarArea } from 'vue-chartjs'
  
  // Register elemen-elemen yang dibutuhkan Chart.js
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    RadialLinearScale,
    ArcElement
  )
  
  export default {
    name: 'PolarAreaChart',
    props: {
        chartData: Object
    },
    components: {
      PolarArea
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
              text: 'Contoh Diagram Polar Area'
            }
          }
        }
      }
    }
  }
  </script>