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
                                                <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-primary">{{statistic.total_task || 0}}</h1> <span class="font-size-12 mb-1">tugas</span></div>
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
                                                <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-primary">{{statistic.total_task_done || 0}}</h1> <span class="font-size-12 mb-1">tugas</span></div>
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
                                                <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-primary">{{statistic.total_customer}}</h1> <span class="font-size-12 mb-1">tugas</span></div>
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
                                                <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-primary">{{statistic.total_task_undone || 0}}</h1><span class="font-size-12 mb-1">tugas</span></div>
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
                                    <h6>Grafik Tugas Keseluruhan</h6>
                                    <div class="bg-light custom-rounded-medium">
                                        <div class="spacer-medium">&nbsp;</div>
                                        <div class="spacer-medium">&nbsp;</div>
                                        <div class="spacer-medium">&nbsp;</div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-4">
                                <div class="card card-body custom-rounded-medium">
                                    <h6>Progress Pengerjaan Tugas</h6>
                                    <div class="bg-light custom-rounded-medium">
                                        <div class="spacer-medium">&nbsp;</div>
                                        <div class="spacer-medium">&nbsp;</div>
                                        <div class="spacer-medium">&nbsp;</div>
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
import { find } from 'lodash'
    
export default {
    name: 'Home',
    data() {
        return {
            statistic: {
                total_customer: 0,
                total_staff: 0,
                total_admin: 0,
            },
            listTrx: [],
        }
    },
    mounted() {
        setTimeout(() => {
        }, 1000);
    },
    methods: {
    }
}
</script>