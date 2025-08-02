<template>
    <main>
        <div id="layout-wrapper">
            <div class="main-content">
                <div class="page-content">
                    <div class="container-fluid">
                        <!-- title of page -->
                        <div class="row">
                            <div class="col-12 mt-3">
                                <div class="page-title-box d-flex align-items-start justify-content-between">
                                    <h4 class="mb-sm-0">Daftar Tugas</h4>
                                    <router-link to="/task/form" class="btn btn-primary button-rounded ms-2" type="button"><i class="mdi mdi-plus me-1"></i>Tambah Tugas Baru</router-link>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <!-- title of page -->
                                <div class="card card-body custom-rounded-medium border">
                                    <ul class="nav nav-pills" role="tablist" style="gap: 0.7rem">
                                        <li class="nav-item waves-effect waves-light" role="presentation">
                                            <a class="nav-link active custom-rounded-medium" data-bs-toggle="tab" role="tab" aria-selected="true" @click="changeTab('')">
                                                <i class="ri-calendar-todo-fill me-2 align-middle fs-5"></i> <span class="d-md-inline-block">Semua Tugas</span> <span class="badge ms-1" :class="{'bg-white text-primary': params.status == '', 'bg-danger text-white': params.status != ''}" v-if="statistic.all">{{ statistic.all }}</span> 
                                            </a>
                                        </li>
                                        <li class="nav-item waves-effect waves-light" role="presentation">
                                            <a class="nav-link custom-rounded-medium" data-bs-toggle="tab" role="tab" aria-selected="false" @click="changeTab('todo')">
                                                <i class="ri-close-circle-fill me-2 align-middle fs-5"></i> <span class="d-md-inline-block">Belum Dikerjakan</span> <span class="badge ms-1" :class="{'bg-white text-primary': params.status == 'todo', 'bg-danger text-white': params.status != 'todo'}" v-if="statistic.todo">{{ statistic.todo }}</span> 
                                            </a>
                                        </li>
                                        <li class="nav-item waves-effect waves-light" role="presentation">
                                            <a class="nav-link custom-rounded-medium" data-bs-toggle="tab" role="tab" aria-selected="false" @click="changeTab('progress')">
                                                <i class="ri-flashlight-fill me-2 align-middle fs-5"></i> <span class="d-md-inline-block">Sedang Dikerjakan</span> <span class="badge ms-1" :class="{'bg-white text-primary': params.status == 'progress', 'bg-warning text-white': params.status != 'progress'}" v-if="statistic.progress">{{ statistic.progress }}</span> 
                                            </a>
                                        </li>
                                        <li class="nav-item waves-effect waves-light" role="presentation">
                                            <a class="nav-link custom-rounded-medium" data-bs-toggle="tab" role="tab" aria-selected="true" @click="changeTab('done')">
                                                <i class="ri-calendar-check-fill me-2 align-middle fs-5"></i> <span class="d-md-inline-block">Tugas Selesai</span> <span class="badge ms-1" :class="{'bg-white text-primary': params.status == 'done', 'bg-success text-white': params.status != 'done'}" v-if="statistic.done">{{ statistic.done }}</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-9">
                                <div class="input-group-left">
                                    <i class="mdi mdi-magnify fs-2 input-group-icon"></i>
                                    <input type="text" class="form-control input-group-form" placeholder="Cari berdasarkan deskripsi tugas disini" v-model="params.keywords" @input="debouncedHandler">
                                </div>
                            </div>
                            <div class="col-md-3" v-if="$store.state.user.role != 'staff'">
                                <select class="form-select select-rounded padding-vertical-10" v-model="params.user_id" @change="fetchData(1)">
                                    <option value="">Semua  Pengguna &nbsp;</option>
                                    <option v-for="item in listUser" :value="item.id">{{ item.nama }} &nbsp;</option>
                                </select>
                            </div>
                        </div>
                        <div class="spacer-medium"></div>
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
                                                    <th><i class="ri-calendar-2-line fs-5"></i></th>
                                                    <th></th>
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
                                                            <div class="d-flex mt-1 align-items-center">
                                                                <i class="ri-alert-line me-1 fs-5 text-danger" v-if="item.prioritas == 'urgent'"></i>
                                                                <i class="ri-arrow-up-circle-line me-1 fs-5 text-warning" v-if="item.prioritas == 'high'"></i>
                                                                <i class="ri-indeterminate-circle-line me-1 fs-5 text-primary" v-if="item.prioritas == 'medium'"></i>
                                                                <i class="ri-arrow-down-circle-line me-1 fs-5 text-success" v-if="item.prioritas == 'low'"></i>
                                                                <div class="text-uppercase fw-bold">{{ item.prioritas }}</div>
                                                            </div>
                                                        </td>
                                                        <td class="middle-item text-nowrap">
                                                            <div class="mb-2">
                                                                <div class="text-muted font-size-13">Tanggal Permintaan</div>
                                                                <div class="fw-bold">{{ $changeFormatDate(item.created_at) }}</div>
                                                            </div>
                                                            <div>
                                                                <div class="text-muted font-size-13">Tanggal Deadline</div>
                                                                <div class="fw-bold">{{ $changeFormatDate(item.deadline) }}</div>
                                                            </div>
                                                        </td>
                                                        <td class="middle-item">
                                                            <div class="d-flex justify-content-end align-items-center">
                                                                <router-link :to="`/task/detail/${item.id}`" class="btn btn-primary button-rounded ms-2 fw-bold border-0" type="button"><div class="d-flex"><i class="ri-search-line me-1"></i>Detail</div></router-link>
                                                                <button type="button" class="btn bg-white border button-rounded ms-2 fw-bold" @click="updateStatus(item.id, 'done')" v-if="item.status == 'progress' && item.penerima_tugas_id == $store.state?.user?.id"><div class="d-flex"><i class="ri-checkbox-circle-line me-1"></i>Selesaikan</div></button>
                                                                <button type="button" class="btn bg-white border button-rounded ms-2 fw-bold" @click="updateStatus(item.id, 'progress')" v-if="item.status == 'todo' && item.penerima_tugas_id == $store.state?.user?.id"><div class="d-flex"><i class="ri-flashlight-fill me-1"></i>Kerjakan</div></button>
                                                                <router-link :to="`/task/form/${item.id}`" class="btn btn-square bg-white border button-rounded ms-2" v-if="item.status != 'done' && item.is_own"><div class="d-flex"><i class="ri-pencil-line fs-5"></i></div></router-link>
                                                                <button class="btn btn-square bg-white border button-rounded ms-2" type="button" @click="deletedData(item)" v-if="item.status != 'done' && item.is_own"><div class="d-flex"><i class="ri-delete-bin-5-line"></i></div></button>
                                                            </div>
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
import {filter, map, debounce} from 'lodash' // library untuk manipulasi array

import apiEndPoint from '@/services/api-endpoint'
import ApiCore from '@/services/core'

export default {
    name: 'Transaction',
    data() {
        return {
            list: [],
            params: {
                user_id: '',
                status: '',
                keywords: '',
            },
            isCheckAll: false,
            pagination: {
                prev: false,
                next: false,
                page: 1,
                limit: 5,
                total: 1
            },
            loading: null,
            statistic: {
                todo: 0,
                progress: 0,
                done: 0
            },
            listUser: [],
        }
    },
    computed: {
        selectedData() {
            return filter(this.list, function(data) { return data.checked; })
        },
    },
    mounted() {
        this.fetchData(1)
        this.fetchDataStatistic()
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
        async fetchDataUser() {
            ApiCore.get(`${apiEndPoint.MASTER_DATA}/list-user`, {}, false).then((result) => {
                if (result.status) {
                    this.listUser = result.data
                }
            })
        },
        async fetchData(page=1) {
            ApiCore.get(apiEndPoint.TASK, {
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
        async fetchDataStatistic() {
            ApiCore.get(`${apiEndPoint.TASK}/statistic`, {}, false).then((result) => {
                if (result.status) {
                    this.statistic = result.data
                }
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
                            const response = await ApiCore.delete(apiEndPoint.TASK, data.id)

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
        async updateStatus(id, status) {
            // menghapus data admin
            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    html: status == 'done' ? `Kamu akan menyelesaikan tugas ini` : `Kamu akan mengerjakan tugas ini`,
                    icon: 'warning',
                    showDenyButton: true,
                    showCancelButton: false,
                    confirmButtonText: 'Ya',
                    confirmButtonColor: status == 'done' ? '#0ac074' : '#3674B5',
                    denyButtonColor: '#c0c0c0',
                    denyButtonText: 'Tidak',
                })
                .then(async (result) => {
                    if (result.isConfirmed) {
                        try {
                            const response = await ApiCore.store(`${apiEndPoint.TASK}/update-status`, {id: id, status: status})

                            if (response.status) {
                                this.fetchData(1)
                                this.fetchDataStatistic()
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
            this.params.status = tab
            this.fetchData(1)
        }
    }
}
</script>