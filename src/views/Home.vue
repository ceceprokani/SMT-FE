<template>
    <main>
        <div id="layout-wrapper">
            <div class="main-content">
                <div class="page-content">
                    <div class="container-fluid">
                        <!-- title of page -->
                        <div class="row">
                            <div class="col-12 mt-3">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0">Selamat Datang</h4>
                                </div>
                            </div>
                        </div>
                        <!-- statistic resident by card -->
                        <div class="row">
                            <div class="col-md-3">
                                <div class="card custom-rounded-medium">
                                    <div class="card-body">
                                        <div class="d-flex">
                                            <div class="avatar-md">
                                                <span class="avatar-title rounded-circle bg-primary h1">
                                                    <i class="ri-calendar-todo-fill text-white"></i>
                                                </span>
                                            </div>
                                            <div class="d-block ms-3">
                                                <p class="mb-1 text-dark">Total Tugas</p>
                                                <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-primary">{{statistic.todo || 0}}</h1> <span class="font-size-12 mb-1">tugas</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- end card-body -->
                                </div>
                                <!-- end card -->
                            </div>
                            <div class="col-md-3">
                                <div class="card custom-rounded-medium">
                                    <div class="card-body">
                                        <div class="d-flex">
                                            <div class="avatar-md">
                                                <span class="avatar-title rounded-circle bg-primary h1">
                                                    <i class="ri-calendar-check-fill text-white"></i>
                                                </span>
                                            </div>
                                            <div class="d-block ms-3">
                                                <p class="mb-1 text-dark">Tugas Selesai</p>
                                                <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-primary">{{statistic.done || 0}}</h1> <span class="font-size-12 mb-1">tugas</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- end card-body -->
                                </div>
                                <!-- end card -->
                            </div>
                            <div class="col-md-3">
                                <div class="card custom-rounded-medium">
                                    <div class="card-body">
                                        <div class="d-flex">
                                            <div class="avatar-md">
                                                <span class="avatar-title rounded-circle bg-primary h1">
                                                    <i class="ri-flashlight-line text-white"></i>
                                                </span>
                                            </div>
                                            <div class="d-block ms-3">
                                                <p class="mb-1 text-dark">Sedang Dikerjakan</p>
                                                <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-primary">{{statistic.progress}}</h1> <span class="font-size-12 mb-1">tugas</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- end card-body -->
                                </div>
                                <!-- end card -->
                            </div>
                            <div class="col-md-3">
                                <div class="card custom-rounded-medium">
                                    <div class="card-body">
                                        <div class="d-flex">
                                            <div class="avatar-md">
                                                <span class="avatar-title rounded-circle bg-primary h1">
                                                    <i class="ri-close-line text-white"></i>
                                                </span>
                                            </div>
                                            <div class="d-block ms-3">
                                                <p class="mb-1 text-dark">Belum Dikerjakan</p>
                                                <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-primary">{{statistic.all || 0}}</h1><span class="font-size-12 mb-1">tugas</span></div>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- end card-body -->
                                </div>
                                <!-- end card -->
                            </div>
                            <!-- end col -->
                        </div>
                        <!-- resident growth -->
                        <h6 class="mb-0 fw-bold mb-3 fs-5">Grafik Tugas</h6>
                        <div class="row">
                            <div class="col-md-8">
                                <div class="card card-body custom-rounded-medium">
                                    <h6 class="mb-4">Grafik Tugas Keseluruhan</h6>
                                    <div class="bg-light custom-rounded-medium" style="height: 400px">
                                        <Line :chartData="chartData" v-if="!fetching && chartData.datasets.length" />
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card card-body custom-rounded-medium">
                                    <h6 class="mb-4">Progress Pengerjaan Tugas</h6>
                                    <div class="bg-light custom-rounded-medium" style="height: 400px">
                                        <Polar :chartData="chartDataProgressPengerjaan" v-if="!fetching && chartDataProgressPengerjaan.datasets.length" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import apiEndPoint from '@/services/api-endpoint'
import ApiCore from '@/services/core'

import Line from '@/components/chart/Line.vue'
import Polar from '@/components/chart/Polar.vue'
import { map } from 'lodash'
    
export default {
    name: 'Home',
    data() {
        return {
            statistic: {
                todo: 0,
                progress: 0,
                done: 0,
                all: 0,
            },
            fetching: false,
            chartDataProgressPengerjaan: {
                labels: ['Belum Dikerjakan', 'Sedang Dikerjakan', 'Sudah Dikerjakan'],
                datasets: []
            },
            chartData: {
                labels: [],
                datasets: []
            },
        }
    },
    components: {Line, Polar},
    mounted() {
        this.fetchDataStatistic()
    },
    methods: {
        async fetchDataStatistic() {
            this.fetching = true
            ApiCore.get(`${apiEndPoint.DASHBOARD}/statistic`, {}, false).then((result) => {
                this.fetching = false
                if (result.status) {
                    this.statistic = result.data.statistic
                    
                    this.chartDataProgressPengerjaan.datasets = [{
                        label: 'Distribusi Warna',
                        data: [this.statistic.todo, this.statistic.progress, this.statistic.done],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.5)',
                            'rgba(255, 205, 86, 0.5)',
                            'rgba(75, 192, 192, 0.5)',
                        ]
                    }]

                    if (result.data.statistic_by_month) {
                        this.chartData.labels = map(this.$listMonth, 'label')

                        let dataSetsStatisticByMonth = []

                        this.$listMonth.forEach(element => {
                            dataSetsStatisticByMonth.push(result.data.statistic_by_month[parseInt(element.id)] || NaN)
                        });
                            
                        this.chartData.datasets = [{
                            label: 'Total Tugas',
                            data: dataSetsStatisticByMonth,
                            borderColor: 'blue',
                            fill: false,
                            tension: 0.5, // Garis lurus
                        }]
                    }
                }
            }).catch(() => {
                this.fetching = false
            })
        },
    }
}
</script>