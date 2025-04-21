<template>
    <main>
        <div id="layout-wrapper">
            <div class="main-content">
                <div class="page-content">
                    <div class="container-fluid">
                        <!-- title of page -->
                        <div class="row justify-content-center">
                            <div class="col-8 mt-3">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0">Form Data Tugas</h4>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-8">
                                <Form :validation-schema="schema" @submit="handleSubmit">
                                    <div class="card custom-rounded-medium">
                                        <div class="card-body">
                                            <h6 class="mb-3">Silahkan lengkapi form dibawah ini dengan benar.</h6>
                                            <div class="spacer-medium"></div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Pemberi Tugas</label>
                                                <Field type="text" name="pemberi_tugas" class="form-control custom-rounded-medium" placeholder="Masukkan nama" disabled />
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Penerima Tugas</label>
                                                <Field as="select" name="penerima_tugas" class="form-select select-rounded padding-vertical-10 mb-2" v-model="form.penerima_tugas">
                                                    <option value="">Pilih  Jabatan &nbsp;</option>
                                                    <option v-for="item in listUser" :value="item.id">{{ item.nama }} &nbsp;</option>
                                                </Field>
                                                <ErrorMessage name="penerima_tugas" :class="'text-danger'" />
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Deskripsi</label>
                                                <Field as="textarea" name="deskripsi" rows="4" class="form-control custom-rounded-medium mb-2" placeholder="Masukkan deskripsi tugas" v-model="form.deskripsi"/>
                                                <ErrorMessage name="deskripsi" :class="'text-danger'" />
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Prioritas</label>
                                                <Field as="select" name="prioritas" class="form-select select-rounded padding-vertical-10 mb-2" v-model="form.prioritas">
                                                    <option value="">Pilih Prioritas &nbsp;</option>
                                                    <option value="urgent">URGENT &nbsp;</option>
                                                    <option value="high">HIGH &nbsp;</option>
                                                    <option value="medium">MEDIUM &nbsp;</option>
                                                    <option value="low">LOW &nbsp;</option>
                                                </Field>
                                                <ErrorMessage name="prioritas" :class="'text-danger'" />
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Catatan</label>
                                                <Field as="textarea" name="catatan" rows="4" class="form-control custom-rounded-medium" placeholder="Masukkan catatan tugas (opsional)" v-model="form.catatan"/>
                                            </div>
                                        </div>
                                        <div class="card-footer card-footer-custom-radius-medium">
                                            <div class="d-flex justify-content-end">
                                                <router-link to="/task" class="btn border-light bg-white custom-rounded-medium me-2">Kembali</router-link>
                                                <button type="submit" class="btn btn-primary custom-rounded-medium">Simpan</button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>
<script>
import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

import apiEndPoint from '@/services/api-endpoint'
import ApiCore from '@/services/core'

export default {
    name: 'MasterAdmin',
    data() {
        return {
            id: this.$route.params.id,
            listUser: [{id: '1', nama: 'Udin Sedunia'}, {id: '2', nama: 'Aldy Wijaya Gustian'}, {id: '3', nama: 'Cecep Rokani'}],
            form: {
                id: '',
                pemberi_tugas: '',
                penerima_tugas: '',
                deskripsi: '',
                prioritas: '',
                catatan: '',
            },
            loading: null,
            togglePasswordVisibility: [false, false]
        }
    },
    components: {
        Field, Form, ErrorMessage
    },
    computed: {
        passwordStrength() {
            const rules = [
                { regex: /.{8,}/, message: 'Password lemah', level: 1 },
                { regex: /[a-z]/, message: 'Password sedang', level: 2 },
                { regex: /[A-Z]/, message: 'Password kuat', level: 3 },
                { regex: /[0-9]/, message: 'Password sangat kuat', level: 4 },
                { regex: /[\W_]/, message: 'Password sangat kuat', level: 5 }
            ];

            if (this.form.password) {
                const strength = rules.reduce((acc, rule) => acc + rule.regex.test(this.form.password), 0);
                return strength ? rules[strength - 1] : false;
            } else {
                return false
            }
        },
        schema() {
            return yup.object({
                penerima_tugas: yup.string().required('Pilih penerima tugas'),
                deskripsi: yup.string().required('Masukkan deskripsi tugas'),
                prioritas: yup.string().required('Pilih prioritas tugas'),
            });
        }
    },
    async mounted() {
        if (this.id) {
            ApiCore.get(`${apiEndPoint.MASTER_ADMIN}/detail`, {id: this.$route.params.id}).then((result) => {
                if (result.status) {
                    this.form = result.data
                }
            })
        }
    },
    methods: {
        async fetchDataUser() {
            this.listUser = []
            ApiCore.get(`${apiEndPoint.MASTER_DATA}/jabatan`).then((result) => {
                if (result.status) {
                    this.listUser = result.data
                }
            })
        },
        async handleSubmit() {
            try {
                this.loading = this.$loading.show()
                // const result = await ApiCore.store(`${apiEndPoint.MANAGE_USER}/save`, {...this.form})
                // this.fetch = false
                // if (result.status) {
                //     // this.$toast.success(result.message);
                // } else {
                //     this.$toast.error(result.message);
                // }
                
                this.$swal.fire({
                    title: 'Sukses',
                    text: 'Tugas berhasil disimpan. BOT sistem akan memberi notifikasi kepada penerima tugas.',
                    icon: 'success'
                })
                this.$router.push({name: 'task'})
                
                this.loading.hide()
            } catch(error) {
                if (this.loading != null)
                    this.loading.hide()
                this.fetch = false

                let message = error.message || error.code

                if (message == 'auth/email-already-in-use')
                    message = 'Email sudah terdaftar, silahkan masukkan email lain!'
                else if (message == 'auth/invalid-email')
                    message = 'Email yang dimasukan tidak valid!'
                else if (message == 'auth/weak-password')
                    message = 'Kombinasi password lemah!'
                
                this.$toast.error(message);
            }
        },
    }
}
</script>