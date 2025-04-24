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
                                    <button type="button" class="btn bg-white border custom-rounded-medium"><div class="d-flex"><i class="ri-download-2-line me-2"></i> Download Excel</div></button>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-2">
                            <div class="col-md-12">
                                <div class="card card-body">
                                    <h6 class="mb-3">Filter Pencarian</h6>
                                    <div class="row mb-3">
                                        <div class="col-md-3">
                                            <select class="form-select select-rounded padding-vertical-10" @change="fetchData(1)">
                                                <option value="">Semua  Pengguna &nbsp;</option>
                                            </select>
                                        </div>
                                        <div class="col-md-2">
                                            <select class="form-select select-rounded padding-vertical-10" @change="fetchData(1)">
                                                <option value="">Semua  Prioritas &nbsp;</option>
                                                <option v-for="item in $priorityTask" :value="item.id">{{ item.label }} &nbsp;</option>
                                            </select>
                                        </div>
                                        <div class="col-md-3">
                                            <select class="form-select select-rounded padding-vertical-10" @change="fetchData(1)">
                                                <option value="">Semua  Status &nbsp;</option>
                                                <option v-for="item in $statusTask" :value="item.id">{{ item.label }} &nbsp;</option>
                                            </select>
                                        </div>
                                        <div class="col-md-4">
                                            <flat-pickr
                                            v-model="dateRange"
                                            :config="config"
                                            placeholder="Pilih Rentang Tanggal"
                                            class="form-control bg-white fw-bold"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div class="input-group-left">
                                        <i class="mdi mdi-magnify fs-2 input-group-icon"></i>
                                        <input type="text" class="form-control input-group-form" placeholder="Cari berdasarkan nama atau email disini" v-model="keywords" @input="debouncedHandler">
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <p>Menampilkan {{pagination.total}} data tugas</p>
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
                                                            <span class="badge bg-warning fs-6" v-if="item.status == 'ongoing'">Sedang Dikerjakan</span>
                                                            <span class="badge bg-success fs-6" v-if="item.status == 'done'">Selesai</span>
                                                        </td>
                                                        <td class="middle-item text-nowrap">
                                                            <div class="text-uppercase fw-bold">{{ item.prioritas }}</div>
                                                        </td>
                                                        <td class="middle-item text-nowrap">
                                                            <div class="fw-bold">{{ $changeFormatDate(item.tanggal_permintaan) }}</div>
                                                            <div class="text-muted font-size-13">Tanggal Permintaan</div>
                                                        </td>
                                                        <td class="middle-item text-nowrap">
                                                            <div class="text-muted font-size-13">Tanggal Deadline</div>
                                                            <div class="fw-bold">{{ $changeFormatDate(item.tanggal_deadline) }}</div>
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
                                <Pagination :page="pagination.page" :prev="pagination.prev" :next="pagination.next" v-on:fetchData="list"></Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import {filter, map, debounce} from 'lodash' // library untuk manipulasi array

import apiEndPoint from '@/services/api-endpoint'
import ApiCore from '@/services/core'

import FlatPickr from 'vue-flatpickr-component';

export default {
    name: 'Transaction',
    data() {
        return {
            list: [
                {
                    id: '1',
                    pemberi_tugas: 'Aldy Wijaya Gustian',
                    penerima_tugas: 'Galuh Subagja',
                    deskripsi: 'Buatkan poster imlek',
                    prioritas: 'urgent',
                    status: 'todo',
                    tanggal_permintaan: '2025-04-24 09:00:00',
                    tanggal_deadline: '2025-05-10 10:00:00',
                },
                {
                    id: '2',
                    pemberi_tugas: 'Cecep Rokani',
                    penerima_tugas: 'Aldy Wijaya Gustian',
                    deskripsi: 'Routing email untuk anank yatim',
                    prioritas: 'urgent',
                    status: 'ongoing',
                    tanggal_permintaan: '2025-04-24 09:00:00',
                    tanggal_deadline: '2025-05-10 10:00:00',
                },
                {
                    id: '3',
                    pemberi_tugas: 'Gugun Santoso',
                    penerima_tugas: 'Aldy Wijaya Gustian',
                    deskripsi: 'Edit cv a.n. Windah & Tarmi',
                    prioritas: 'Medium',
                    status: 'done',
                    tanggal_permintaan: '2025-04-24 09:00:00',
                    tanggal_deadline: '2025-05-10 10:00:00',
                },
            ],
            dateRange: '',
            config: {
                mode: 'range',
                dateFormat: 'Y-m-d',
                altInput: true,
            },
            params: {
                rw_id: '',
                status: '',
                keywords: '',
            },
            status: '',
            isCheckAll: false,
            pagination: {
                prev: false,
                next: false,
                page: 1,
                limit: 5,
                total: 3
            },
            loading: null,
        }
    },
    computed: {
        selectedData() {
            return filter(this.list, function(data) { return data.checked; })
        },
    },
    components: {FlatPickr},
    mounted() {
        // this.fetchData(1)
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
            ApiCore.get(apiEndPoint.TRANSACTION, {
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
        async deletedData(data) {
            // menghapus data admin
            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    html: `Kamu akan menghapus data dengan nama penerima tugas <b>${data.penerima_tugas}</b>`,
                    icon: 'warning',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Ya',
                    confirmButtonColor: '#3674B5',
                    denyButtonColor: '#c0c0c0',
                    denyButtonText: 'Tidak',
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const response = await ApiCore.delete(apiEndPoint.TRANSACTION, data.trx_id)

                            if (response.status) {
                                this.fetchData(1)
                                this.$toast.success(response.message);
                            } else {
                                this.$toast.error(response.message);
                            }
                        } catch(error) {
                            this.$toast.error(error);
                        }
                    }
                });
        },
        changeTab(tab) {
            this.status = tab
        }
    }
}
</script>