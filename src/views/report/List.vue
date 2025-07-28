<template>
    <main>
        <div id="layout-wrapper">
            <div class="main-content">
                <div class="page-content">
                    <div class="container-fluid">
                        <!-- title of page -->
                        <div class="row">
                            <div class="col-12 mt-3">
                                <div class="page-title-box d-sm-flex align-items-start justify-content-between">
                                    <h4 class="mb-sm-0">Laporan Tugas</h4>
                                    <button type="button" class="btn bg-white border custom-rounded-medium" @click="download"><div class="d-flex"><i class="ri-download-2-line me-2"></i> Download Laporan</div></button>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-12">
                                <div class="card card-body">
                                    <h6 class="mb-3">Filter Pencarian</h6>
                                    <div class="row mb-3">
                                        <div class="col-md-3" v-if="$store.state.user.role != 'staff'">
                                            <select class="form-select select-rounded padding-vertical-10" v-model="params.user_id" @change="fetchData(1)">
                                                <option value="">Semua  Pengguna &nbsp;</option>
                                                <option v-for="item in listUser" :value="item.id">{{ item.nama }} &nbsp;</option>
                                            </select>
                                        </div>
                                        <div class="col-md-2">
                                            <select class="form-select select-rounded padding-vertical-10" v-model="params.prioritas" @change="fetchData(1)">
                                                <option value="">Semua  Prioritas &nbsp;</option>
                                                <option v-for="item in $priorityTask" :value="item.id">{{ item.label }} &nbsp;</option>
                                            </select>
                                        </div>
                                        <div class="col-md-3">
                                            <select class="form-select select-rounded padding-vertical-10" v-model="params.status" @change="fetchData(1)">
                                                <option value="">Semua  Status &nbsp;</option>
                                                <option v-for="item in $statusTask" :value="item.id">{{ item.label }} &nbsp;</option>
                                            </select>
                                        </div>
                                        <div :class="{'col-md-7': $store.state.user.role == 'staff', 'col-md-4': $store.state.user.role != 'staff'}">
                                            <flat-pickr
                                            v-model="params.dateRange"
                                            :config="config"
                                            @change="fetchData(1)"
                                            placeholder="Pilih Rentang Tanggal Deadline"
                                            class="form-control bg-white fw-bold"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div class="input-group-left">
                                        <i class="mdi mdi-magnify fs-2 input-group-icon"></i>
                                        <input type="text" class="form-control input-group-form" placeholder="Cari berdasarkan deskripsi tugas disini" v-model="params.keywords" @input="debouncedHandler">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="d-flex flex-wrap align-items-center justify-content-between mb-3">
                                    <div class="flex-shrink-0">Menampilkan {{pagination.total}} data tugas</div>
                                    <div class="d-flex align-items-center flex-shrink-0">
                                        <label for="limitDropdown" class="me-2 mb-0 fw-normal">Tampilkan data per halaman</label>
                                        <select id="limitDropdown" class="form-select select-rounded w-auto" v-model.number="pagination.limit" @change="fetchData(1)">
                                            <option :value="5">5</option>
                                            <option :value="10">10</option>
                                            <option :value="20">20</option>
                                            <option :value="30">30</option>
                                            <option :value="40">40</option>
                                            <option :value="50">50</option>
                                            <option :value="100">100</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="card card-body custom-rounded-medium p-0">
                                    <div class="table-responsive">
                                        <table class="table table-bordered table-striped mb-0">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th class="text-nowrap">Pemberi Tugas</th>
                                                    <th class="text-nowrap">Penerima Tugas</th>
                                                    <th class="text-nowrap">Deskripsi Tugas</th>
                                                    <th>Status</th>
                                                    <th>Prioritas</th>
                                                    <th colspan="2"><i class="ri-calendar-2-line fs-5"></i></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <template v-if="pagination.total > 0">
                                                    <tr v-for="item, index in list">
                                                        <td class="middle-item">{{ (index + 1) + (pagination.page - 1) * pagination.limit }}</td>
                                                        <td class="middle-item">{{ item.pemberi_tugas }}</td>
                                                        <td class="middle-item">{{ item.penerima_tugas }}</td>
                                                        <td class="middle-item text-wrap">{{ item.deskripsi || '-' }}</td>
                                                        <td class="middle-item text-nowrap">
                                                            <span class="badge bg-danger fs-6" v-if="item.status == 'todo'">Belum Dikerjakan</span>
                                                            <span class="badge bg-warning fs-6" v-if="item.status == 'progress'">Sedang Dikerjakan</span>
                                                            <span class="badge bg-success fs-6" v-if="item.status == 'done'">Selesai</span>
                                                        </td>
                                                        <td class="middle-item text-nowrap">
                                                            <div class="text-uppercase fw-bold">{{ item.prioritas }}</div>
                                                        </td>
                                                        <td class="middle-item text-nowrap">
                                                            <div class="text-muted font-size-13">Tanggal Permintaan</div>
                                                            <div class="fw-bold">{{ $changeFormatDate(item.created_at) }}</div>
                                                        </td>
                                                        <td class="middle-item text-nowrap">
                                                            <div class="text-muted font-size-13">Tanggal Deadline</div>
                                                            <div class="fw-bold">{{ $changeFormatDate(item.deadline) }}</div>
                                                        </td>
                                                    </tr>
                                                </template>
                                                <template v-else>
                                                    <tr>
                                                        <td colspan="9" class="text-muted">Data tidak ditemukan</td>
                                                    </tr>
                                                </template>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center" v-if="pagination.total > 0">
                            <div class="col-auto">
                                <Pagination :page="pagination.page" :prev="pagination.prev" :next="pagination.next" v-on:fetchData="fetchData"></Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import {debounce} from 'lodash' // library untuk manipulasi array

import apiEndPoint from '@/services/api-endpoint'
import ApiCore from '@/services/core'

import FlatPickr from 'vue-flatpickr-component';

export default {
    name: 'Transaction',
    data() {
        return {
            list: [],
            config: {
                mode: 'range',
                dateFormat: 'Y-m-d',
                altInput: true,
            },
            params: {
                user_id: '',
                status: '',
                prioritas: '',
                keywords: '',
                dateRange: '',
            },
            pagination: {
                prev: false,
                next: false,
                page: 1,
                limit: 5,
                total: 0
            },
            loading: null,
            listUser: []
        }
    },
    components: {FlatPickr},
    mounted() {
        this.fetchData(1)
        this.fetchDataUser()
    },
    created() {
        this.debouncedHandler = debounce(() => {
            this.pagination.page = 1
            this.fetchData(this.pagination.page)
        }, 500);
    },
    beforeUnmount() {
        this.debouncedHandler.cancel();
    },
    methods: {
        async fetchData(page=1) {
            ApiCore.get(apiEndPoint.REPORT, {
                page: page,
                limit: this.pagination.limit,
                ...this.params
            }).then((result) => {
                if (result.status) {
                    this.list = result.data
                } else {
                    this.list = [];
                }
                this.pagination.prev    = result.pagination.prev
                this.pagination.next    = result.pagination.next
                this.pagination.page    = result.pagination.page
                this.pagination.total   = result.pagination.total
            })
        },
        async fetchDataUser() {
            ApiCore.get(`${apiEndPoint.MASTER_DATA}/list-user`, {}, false).then((result) => {
                if (result.status) {
                    this.listUser = result.data
                }
            })
        },
        download() {
            ApiCore.get(`${apiEndPoint.REPORT}/download`, this.params).then((result) => {
                const link = document.createElement('a');
                link.href = result.url;
                link.target = '_blank'; // mencegah pindah halaman jika browser tidak support download
                link.setAttribute('download', `laporan.pdf`);
                document.body.appendChild(link);
                link.click();
            })
        },
    }
}
</script>