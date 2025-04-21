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
                                    <h4 class="mb-sm-0">Data Transaksi</h4>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-12">
                                <!-- title of page -->
                                <div class="card card-body custom-rounded-medium border">
                                    <ul class="nav nav-pills" role="tablist" style="gap: 0.7rem">
                                        <li class="nav-item waves-effect waves-light" role="presentation">
                                            <a class="nav-link active custom-rounded-medium" data-bs-toggle="tab" role="tab" aria-selected="true" @click="changeTab(0)">
                                                <i class="mdi mdi-close-circle me-2 align-middle fs-5"></i> <span class="d-md-inline-block">Belum Bayar</span> 
                                            </a>
                                        </li>
                                        <li class="nav-item waves-effect waves-light" role="presentation">
                                            <a class="nav-link custom-rounded-medium" data-bs-toggle="tab" role="tab" aria-selected="false" @click="changeTab(1)">
                                                <i class="mdi mdi-check-circle me-2 align-middle fs-5"></i> <span class="d-md-inline-block">Sudah Bayar</span> 
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div class="row mb-3">
                            <div class="col-md-8">
                                <div class="input-group-left">
                                    <i class="mdi mdi-magnify fs-2 input-group-icon"></i>
                                    <input type="text" class="form-control input-group-form" placeholder="Cari berdasarkan nama atau email disini" v-model="params.keywords">
                                </div>
                            </div>
                            <div class="col-md-2 text-end">
                                <select class="form-select select-rounded padding-vertical-10" v-model="params.rw_id" @change="fetchData(1)">
                                    <option value="">Semua  RW &nbsp;</option>
                                    <option v-for="data in $listRW" :value="data.value">{{ data.label }} &nbsp;</option>
                                </select>
                            </div>
                            <div class="col-md-2 text-end">
                                <select class="form-select select-rounded padding-vertical-10" v-model="params.status" @change="fetchData(1)">
                                    <option value="">Semua  Status &nbsp;</option>
                                    <option value="nobill">Belum Ditagih &nbsp;</option>
                                    <option value="bill">Sudah Ditagih &nbsp;</option>
                                </select>
                            </div>
                        </div>
                        <div class="spacer-medium"></div>
                        <div class="row">
                            <div class="col-md-12">
                                <p>Menampilkan {{pagination.total}} data pelanggan</p>
                                <div class="table-responsive">
                                    <table class="table table-custom-card">
                                        <thead>
                                            <tr>
                                                <th>#</th>
                                                <th>Nama</th>
                                                <th>Alamat</th>
                                                <th>No Pelanggan</th>
                                                <th>No HP</th>
                                                <th>Total Tagihan</th>
                                                <th v-if="status == 1">Total Pembayaran</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <template v-if="pagination.total > 0">
                                                <tr v-for="item, index in list">
                                                    <td class="middle-item">{{ (index + 1) + (pagination.page - 1) * pagination.limit }}</td>
                                                    <td class="middle-item">{{ item.nama }}</td>
                                                    <td class="middle-item">{{ item.alamat }}</td>
                                                    <td class="middle-item">{{ item.no_pel || '-' }}</td>
                                                    <td class="middle-item">{{ item.telepon }}</td>
                                                    <td class="middle-item">
                                                        <div v-if="item.trx_id" class="d-block">
                                                            <div class="d-flex align-items-center text-muted font-size-12">Biaya Admin <i class="ri-arrow-right-s-line font-size-14"></i> <span class="text-primary fw-bold">Rp. {{$toCurrency(item.harga_air?.beban, 0)}}</span></div>
                                                            <div class="d-flex align-items-center text-muted font-size-12 mb-1">Biaya Meteran <i class="ri-arrow-right-s-line font-size-14"></i> <span class="text-primary fw-bold">Rp. {{$toCurrency(item.total_tagihan - item.harga_air?.beban, 0)}}</span></div>
                                                            <div class="custom-rounded-small px-3 py-1 text-white bg-primary font-size-16 fw-bold">{{ `Rp. ${$toCurrency(item.total_tagihan)}` }}</div>
                                                        </div>
                                                        <span class="badge bg-danger fs-6" v-else>Belum Ditagih</span>
                                                    </td>
                                                    <td class="middle-item fw-bold" v-if="status == 1">{{ item.payment ? $toCurrency(item.payment) : 'Rp. 0' }}</td>
                                                    <td class="middle-item">
                                                        <div class="d-flex justify-content-end align-items-center">
                                                            <template v-if="item.trx_id">
                                                                <button type="button" class="btn btn-white custom-rounded-medium border bg-white" @click="deletedData(item)"><div class="d-flex align-items-center"><i class="mdi mdi-trash-can-outline fs-5 me-1"></i> Hapus Tagihan</div></button>
                                                                <router-link :to="`/transaction/form/${item.id}`" class="btn btn-primary button-rounded ms-2" type="button"><div class="d-flex align-items-center"><i class="ri-wallet-3-line me-1"></i>Bayar Tagihan</div></router-link>
                                                            </template>
                                                            <router-link :to="`/transaction/form/${item.id}`" class="btn btn-primary button-rounded ms-2" type="button" v-else><i class="mdi mdi-plus me-1"></i>Buat Tagihan</router-link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </template>
                                            <template v-else>
                                                <tr>
                                                    <td colspan="7" class="text-muted">Data tidak ditemukan</td>
                                                </tr>
                                            </template>
                                        </tbody>
                                    </table>
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
    name: 'Transaction',
    data() {
        return {
            list: [],
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
                total: 0
            },
            loading: null,
        }
    },
    computed: {
        selectedData() {
            return filter(this.list, function(data) { return data.checked; })
        },
    },
    mounted() {
        this.fetchData(1)
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