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
                                    <h4 class="mb-sm-0">Kelola Pengguna</h4>
                                    <div class="d-flex">
                                        <button class="btn button-rounded" type="button" :class="{'btn-light': selectedData.length <= 0, 'bg-white': selectedData.length > 0}" :disabled="selectedData.length <= 0" @click="deletedDataBatch()"><i class="mdi mdi-trash-can-outline me-1"></i>Hapus Terpilih</button>
                                        <router-link to="/manage-users/form" class="btn btn-primary button-rounded ms-2" type="button"><i class="mdi mdi-plus me-1"></i>Tambah Baru</router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-10">
                                <div class="input-group-left">
                                    <i class="mdi mdi-magnify fs-2 input-group-icon"></i>
                                    <input type="text" class="form-control input-group-form" placeholder="Cari berdasarkan nama atau email disini" v-model="keywords" @input="debouncedHandler">
                                </div>
                            </div>
                            <div class="col-md-2 text-end">
                                <select class="form-select select-rounded padding-vertical-10" @change="fetchData(1)">
                                    <option value="">Semua  Jabatan &nbsp;</option>
                                </select>
                            </div>
                        </div>
                        <div class="spacer-medium"></div>
                        <div class="row">
                            <div class="col-md-12">
                                <p>Menampilkan {{pagination.total}} data pengguna</p>
                                <div class="card card-body custom-rounded-medium p-0">
                                    <div class="table-responsive">
                                        <table class="table table-bordered table-striped mb-0">
                                            <thead>
                                                <tr>
                                                    <th width="2%"><input type="checkbox" class="form-check-input" v-model="isCheckAll" @change="checkAll()" v-if="pagination.total > 0" /></th>
                                                    <th>Nama</th>
                                                    <th>Email</th>
                                                    <th>No HP</th>
                                                    <th>Jabatan</th>
                                                    <th>Status</th>
                                                    <th v-if="$store.state.user?.role == 'superadmin'">Password</th>
                                                    <th></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <template v-if="pagination.total > 0">
                                                    <tr v-for="item in list">
                                                        <td class="middle-item"><input type="checkbox" class="form-check-input" v-model="item.checked" /></td>
                                                        <td class="middle-item">{{ item.nama }}</td>
                                                        <td class="middle-item">{{ item.email }}</td>
                                                        <td class="middle-item">{{ item.telepon }}</td>
                                                        <td class="middle-item">{{ item.jabatan || '-' }}</td>
                                                        <td class="middle-item">
                                                            <span class="badge bg-primary fs-6" v-if="item.status == 'active'">Aktif</span>
                                                            <span class="badge bg-light fs-6" v-else>Tidak Aktif</span>
                                                        </td>
                                                        <td class="middle-item" v-if="$store.state.user?.role == 'superadmin'">{{ item.password_raw || '-' }}</td>
                                                        <td class="middle-item">
                                                            <div class="d-flex justify-content-end align-items-center">
                                                                <router-link :to="`manage-users/form/${item.id}`" class="btn btn-square border bg-white me-2"><i class="mdi mdi-circle-edit-outline fs-4"></i></router-link>
                                                                <button type="button" class="btn btn-square border bg-white" @click="deletedData(item)"><i class="mdi mdi-trash-can-outline fs-4"></i></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </template>
                                                <template v-else>
                                                    <tr>
                                                        <td colspan="8" class="text-muted">Data tidak ditemukan</td>
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
                                <Pagination :page="pagination.page" :prev="pagination.prev" :next="pagination.next" v-on:fetchData="paginationData"></Pagination>
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
    name: 'ManageUser',
    data() {
        return {
            list: [
                {
                    id: 1,
                    nama: "Budi Santoso",
                    email: "budi@example.com",
                    telepon: "081234567890",
                    jabatan: "Manager",
                    status: "active",
                    password_raw: "budi123"
                },
                {
                    id: 2,
                    nama: "Siti Aminah",
                    email: "siti@example.com",
                    telepon: "081298765432",
                    jabatan: "Staff HRD",
                    status: "deactive",
                    password_raw: "siti456"
                },
                {
                    id: 3,
                    nama: "Agus Prasetyo",
                    email: "agus@example.com",
                    telepon: "081377788899",
                    jabatan: "Admin",
                    status: "active",
                    password_raw: "agus789"
                }
            ],
            keywords: '',
            isCheckAll: false,
            pagination: {
                prev: false,
                next: false,
                page: 1,
                limit: 5,
                total: 3
            },
            loading: null,
            rwId: '',
        }
    },
    computed: {
        selectedData() {
            return filter(this.list, function(data) { return data.checked; })
        },
    },
    watch: {
        keywords(value) {
            this.keywords=value
        }
    },
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
        paginationData(page) {
            this.pagination.page = page
            this.fetchData(page)
        },
        async fetchData(page=1) {
            ApiCore.get(apiEndPoint.MANAGE_USER, {
                keywords: this.keywords,
                page: page,
                limit: this.pagination.limit,
                rwId: this.rwId
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
                    html: `Kamu akan menghapus data dengan nama <b>${data.nama}</b>`,
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
                            const response = await ApiCore.delete(`${apiEndPoint.MANAGE_USER}`, data.id)

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
        checkAll() {
            // checklist semua data admin
            this.list.forEach(element => {
                element.checked = this.isCheckAll
            });
        },
        async deletedDataBatch() {
            // hapus data admin yang terpilih
            const listId = map(this.selectedData, 'id')

            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    html: `Kamu akan menghapus <b>${listId.length}</b> data yang terpilih`,
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
                            this.isCheckAll = false // menghilangkan ceklist pada chekcbox
                            
                            const response = await ApiCore.bulkDelete(`${apiEndPoint.MANAGE_USER}`, listId)

                            if (response.status) {
                                this.fetchData(this.pagination.page)
                                this.$toast.success(response.message);
                            } else {
                                this.$toast.error(response.message);
                            }
                            this.$toast.success('Data berhasil dihapus');
                        } catch(error) {
                            this.$toast.error(error);
                        }
                    }
                });
        },
    }
}
</script>