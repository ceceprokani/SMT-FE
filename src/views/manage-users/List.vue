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
                            <div class="col-md-12">
                                <div class="input-group-left">
                                    <i class="mdi mdi-magnify fs-2 input-group-icon"></i>
                                    <input type="text" class="form-control input-group-form" placeholder="Cari berdasarkan nama atau email disini" v-model="keywords" @input="debouncedHandler">
                                </div>
                            </div>
                            <div class="d-none col-md-2 text-end">
                                <select class="form-select select-rounded padding-vertical-10" @change="fetchData(1)">
                                    <option value="">Semua  Jabatan &nbsp;</option>
                                </select>
                            </div>
                        </div>
                        <div class="spacer-medium"></div>
                        <div class="row">
                            <div class="col-md-12">
                                <div class="d-flex flex-wrap align-items-center justify-content-between mb-3">
                                    <div class="flex-shrink-0">Menampilkan {{pagination.total}} data pengguna</div>
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
                                                                <button type="button" class="btn border custom-rounded-medium padding-vertical-10 me-2 bg-white text-nowrap" data-bs-toggle="modal" data-bs-target=".modal-password" @click="updateData(item)">Ubah Password</button>
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
                                <Pagination :page="pagination.page" :prev="pagination.prev" :next="pagination.next" v-on:fetchData="fetchData"></Pagination>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
    <div class="modal fade modal-password custom-rounded-medium" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal modal-dialog-centered">
            <div class="modal-content custom-rounded-medium">
                <Form :validation-schema="schema" @submit="handleSubmit">
                <div class="modal-header border-0">
                    <div class="d-block">
                        <div class="modal-title">Ubah Password</div>
                        <h5 class="modal-title mb-0">{{ form.name }}</h5>
                    </div>
                </div>
                <div class="modal-body">
                    <div class="form-group" :class="{'mb-2': passwordStrength, 'mb-3': !passwordStrength}">
                        <label class="form-label">Password</label>
                        <div style="position: relative;">
                            <Field :type="togglePasswordVisibility[0] ? 'text' : 'password'" name="password" class="form-control" placeholder="Masukkan password" v-model="form.password" />
                            <i class="mdi" v-if="form.password" :class="{'mdi-eye': togglePasswordVisibility[0], 'mdi-eye-off': !togglePasswordVisibility[0]}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility[0] = !togglePasswordVisibility[0]"></i>
                        </div>
                        <ErrorMessage name="password" :class="'text-danger'" />
                    </div>
                    <div class="d-flex mb-3 fw-bold" v-if="passwordStrength" :class="{'text-danger': passwordStrength.level < 2, 'text-primary': passwordStrength.level <= 4, 'text-success': passwordStrength.level >= 5}">
                        <i class="mdi me-2" :class="{'mdi-alert': passwordStrength.level < 5, 'mdi-check-circle': passwordStrength.level >= 5}"></i>
                        <div>{{passwordStrength.message}}</div>
                    </div>
                    <div class="form-group mb-3">
                        <label class="form-label">Konfirmasi Password</label>
                        <div style="position: relative;">
                            <Field :type="togglePasswordVisibility[1] ? 'text' : 'password'" name="password_confirm" class="form-control" placeholder="Masukkan konfirmasi password" v-model="form.confirmPassword" />
                            <i class="mdi" v-if="form.confirmPassword" :class="{'mdi-eye': togglePasswordVisibility[1], 'mdi-eye-off': !togglePasswordVisibility[1]}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility[1] = !togglePasswordVisibility[1]"></i>
                        </div>
                        <ErrorMessage name="password_confirm" :class="'text-danger'" />
                    </div>
                    <div class="alert alert-info custom-rounded-medium">
                        <h6>
                            <i class="mdi mdi-information me-2"></i>Rekomendasi kombinasi password :
                        </h6>
                        <ul class="mt-2 mb-0 font-size-12">
                            <li>Memiliki setidaknya 8 karakter</li>
                            <li>Mengandung minimal satu huruf kecil (a-z).</li>
                            <li>Mengandung minimal satu huruf besar (A-Z).</li>
                            <li>Mengandung minimal satu angka (0-9).</li>
                            <li>Mengandung minimal satu simbol (misalnya: !@#$%^&*()_+).</li>
                        </ul>
                    </div>
                </div>
                <div class="modal-footer border-0 p-3">
                    <button type="button" class="btn btn-light waves-effect custom-rounded-medium fw-bold px-3" data-bs-dismiss="modal">Tutup</button>
                    <button type="submit" class="btn btn-primary waves-effect custom-rounded-medium fw-bold px-3">Simpan</button>
                </div>
                </Form>
            </div>
        </div>
    </div>
</template>
<script>
import {filter, map, debounce} from 'lodash' // library untuk manipulasi array

import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

import apiEndPoint from '@/services/api-endpoint'
import ApiCore from '@/services/core'

export default {
    name: 'ManageUser',
    data() {
        return {
            list: [],
            keywords: '',
            isCheckAll: false,
            pagination: {
                prev: false,
                next: false,
                page: 1,
                limit: 5,
                total: 0
            },
            loading: null,
            form: {
                password: '',
                confirmPassword: ''
            },
            togglePasswordVisibility: [false, false]
        }
    },
    components: {
        Field, Form, ErrorMessage
    },
    computed: {
        selectedData() {
            return filter(this.list, function(data) { return data.checked; })
        },
        passwordStrength() {
            const rules = [
                { regex: /.{8,}/, message: 'Password minimal 8 karakter', level: 1 },
                { regex: /[a-z]/, message: 'Password harus mengandung huruf kecil (a-z)', level: 2 },
                { regex: /[A-Z]/, message: 'Password harus mengandung huruf besar (A-Z)', level: 3 },
                { regex: /[0-9]/, message: 'Password harus mengandung angka (0-9)', level: 4 },
                { regex: /[\W_]/, message: 'Password harus mengandung simbol', level: 5 }
            ];

            if (this.form.password) {
                let passed = 0;
                let failedRule = null;
                for (let i = 0; i < rules.length; i++) {
                    if (rules[i].regex.test(this.form.password)) {
                        passed++;
                    } else {
                        failedRule = rules[i];
                    break;
                    }
                }
                if (passed === rules.length) {
                    return { level: 5, message: 'Password sangat kuat' };
                } else if (failedRule) {
                    return { level: passed, message: failedRule.message };
                }
            }
            return false;
        },
        schema() {
            return yup.object({
                password: !this.$route.params.id
                    ? yup.string()
                        .required('Masukkan password')
                        // .min(8, 'Masukkan password minimal 8 karakter')
                    : null,
                password_confirm: !this.$route.params.id ? yup.string().required('Masukkan konfirmasi password').min(8, 'Masukkan password minimal 8 karakter') : null,
            });
        }
    },
    watch: {
        keywords(value) {
            this.keywords=value
        }
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
        updateData(data) {
            this.form = {
                id: data.id,
                name: data.nama,
                email: data.email,
            }
        },
        async handleSubmit() {
            try {
                if (this.passwordStrength && this.passwordStrength.level < 5) {
                    this.$toast.error(this.passwordStrength.message);
                    return;
                } if (this.form.password && this.form.password !== this.form.confirmPassword) {
                    this.$toast.error('Konfirmasi password tidak sesuai!');
                    return;
                }

                this.loading = this.$loading.show()
                const result = await ApiCore.store(`${apiEndPoint.MANAGE_USER}/change-password`, {...this.form})
                this.fetch = false
                if (result.status) {
                    this.$toast.success(result.message);
                    this.fetchData(this.pagination.page)
                } else {
                    this.$toast.error(result.message);
                }
                
                this.loading.hide()
            } catch(error) {
                if (this.loading != null)
                    this.loading.hide()
                this.fetch = false

                let message = error.message || error.code
                
                this.$toast.error(message);
            }
        },
    }
}
</script>