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
                                    <h4 class="mb-sm-0">Dashboard</h4>
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
                                                    <i class="mdi mdi-account-outline text-white"></i>
                                                </span>
                                            </div>
                                            <div class="d-block ms-3">
                                                <p class="mb-1 text-dark">Jumlah Admin</p>
                                                <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-primary">{{statistic.total_admin}}</h1> <span class="font-size-12 mb-1">orang</span></div>
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
                                                    <i class="mdi mdi-card-account-details-outline text-white"></i>
                                                </span>
                                            </div>
                                            <div class="d-block ms-3">
                                                <p class="mb-1 text-dark">Jumlah Petugas</p>
                                                <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-primary">{{statistic.total_staff}}</h1> <span class="font-size-12 mb-1">orang</span></div>
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
                                                    <i class="mdi mdi-account-group-outline text-white"></i>
                                                </span>
                                            </div>
                                            <div class="d-block ms-3">
                                                <p class="mb-1 text-dark">Jumlah Pelanggan</p>
                                                <div class="d-flex align-items-end"><h1 class="mb-0 me-2 fw-bold text-primary">{{statistic.total_customer}}</h1> <span class="font-size-12 mb-1">orang</span></div>
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
                                                    <i class="mdi mdi-water-outline text-white"></i>
                                                </span>
                                            </div>
                                            <div class="d-block ms-3">
                                                <p class="mb-1 text-dark">Harga Air</p>
                                                <div class="d-flex align-items-end"><span class="font-size-12 mb-1">Rp. </span><h1 class="mb-0 me-2 fw-bold text-primary">{{statistic.total_customer}}</h1></div>
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
                        <h6 class="mb-0 fw-bold mb-3 fs-5"><i class="mdi mdi-map-marker-multiple me-2"></i>Daftar Tagihan</h6>
                        <div class="row">
                            <template v-if="listTrx.length">
                                <div class="col-md-3" v-for="item in listTrx">
                                    <div class="card custom-rounded-medium">
                                        <div class="card-body">
                                            <div class="d-flex align-items-center justify-content-between mb-2">
                                                <h4 class="mt-0 mb-0 me-3 mb-2">{{ item.name }}</h4>
                                                <router-link class="btn btn-white border btn-sm custom-rounded-medium"><i class="mdi mdi-magnify"></i> Detail</router-link>
                                            </div>
                                            <div class="d-block bg-light py-2 px-3 custom-rounded-medium">
                                                <div class="mb-2">Penanggung Jawab</div>
                                                <div class="fw-bold">{{ item.supervisor?.name }}</div>
                                                <div class="fw-bold">{{ item.supervisor?.phone }}</div>
                                            </div>
                                        </div>
                                        <!-- end card-body -->
                                    </div>
                                    <!-- end card -->
                                </div>
                            </template>
                            <div v-else class="col-md-12">
                                <div class="bg-light p-3 custom-rounded-medium">
                                    <div class="text-muted">
                                        Belum ada tagihan untuk saat ini
                                    </div>
                                </div>
                            </div>
                            <!-- end col -->
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