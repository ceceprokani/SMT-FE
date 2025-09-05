<template>
    <main>
        <div id="layout-wrapper">
            <div class="main-content">
                <div class="page-content">
                    <div class="container-fluid">
                        <!-- title of page -->
                        <div class="row justify-content-center">
                            <div class="col-md-8 mt-3">
                                <div class="page-title-box d-flex align-items-center">
                                    <router-link to="/task" class="btn btn-square bg-white border custom-rounded-medium me-3"><i class="ri-arrow-left-s-line fs-4"></i></router-link>
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
                                                <div class="text-primary fs-5 fw-bold mb-4 p-3 alert-info custom-rounded-medium">{{ $store.state?.user?.name }}</div>
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Penerima Tugas <span class="text-danger">*</span></label>
                                                <Field as="select" name="penerima_tugas_id" class="form-select select-rounded padding-vertical-10 mb-2" v-model="form.penerima_tugas_id">
                                                    <option value="">Pilih Penerima Tugas &nbsp;</option>
                                                    <option v-for="item in listUser" :value="item.id">{{ item.nama }} &nbsp;</option>
                                                </Field>
                                                <ErrorMessage name="penerima_tugas_id" :class="'text-danger'" />
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Deskripsi Tugas <span class="text-danger">*</span></label>
                                                <Field as="textarea" name="deskripsi" rows="4" class="form-control custom-rounded-medium mb-2" placeholder="Masukkan deskripsi tugas" v-model="form.deskripsi"/>
                                                <ErrorMessage name="deskripsi" :class="'text-danger'" />
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Deadline Tugas <span class="text-danger">*</span></label>
                                                <Field
                                                    type="datetime-local"
                                                    name="deadline"
                                                    class="form-control mb-2"
                                                    v-model="form.deadline"
                                                    :min="new Date().toISOString().slice(0,16)"
                                                    @change="calculatePriority()"
                                                />
                                                <ErrorMessage name="deadline" :class="'text-danger'" />
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Prioritas</label>
                                                <Field type="hidden" name="prioritas" class="mb-2" v-model="form.prioritas"></Field>
                                                <div class="d-block mb-3" v-if="form.prioritas">
                                                    <div class="badge custom-rounded-medium bg-primary p-2 text-uppercase fs-6">{{ form.prioritas }}</div>
                                                </div>
                                                <div class="alert alert-info custom-rounded-medium p-3">
                                                    <p class="d-flex mb-1"><i class="ri-information-fill me-2"></i> Prioritas otomatis berdasarkan deadline:</p>
                                                    <ul class="list-unstyled mb-0">
                                                        <li><b>Urgent</b>: Deadline kurang dari atau sama dengan 1 hari</li>
                                                        <li><b>High</b>: Deadline antara 2 sampai 3 hari</li>
                                                        <li><b>Medium</b>: Deadline antara 4 sampai 5 hari</li>
                                                        <li><b>Low</b>: Deadline lebih dari 5 hari</li>
                                                    </ul>
                                                </div>
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
            listUser: [],
            form: {
                id: this.$route.params.id || '',
                tugas_detail_id: '',
                pemberi_tugas: '',
                penerima_tugas_id: '',
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
        schema() {
            return yup.object({
                penerima_tugas_id: yup.string().required('Pilih penerima tugas'),
                deskripsi: yup.string().required('Masukkan deskripsi tugas'),
                // prioritas: yup.string().required('Pilih prioritas tugas'),
                deadline: yup.string().required('Masukan deadline tugas'),
            });
        }
    },
    async mounted() {
        this.fetchDataUser()
        if (this.id) {
            ApiCore.get(`${apiEndPoint.TASK}/detail`, {id: this.$route.params.id}).then((result) => {
                if (result.status) {
                    this.form = result.data
                }
            })
        }
    },
    methods: {
        async fetchDataUser() {
            this.listUser = []
            ApiCore.get(`${apiEndPoint.MASTER_DATA}/list-user`).then((result) => {
                if (result.status) {
                    this.listUser = result.data.filter((data) => data.id != this.$store.state.user.id)
                }
            })
        },
        async handleSubmit() {
            try {
                this.loading = this.$loading.show()
                const result = await ApiCore.store(`${apiEndPoint.TASK}/save`, {...this.form})
                this.fetch = false
                this.loading.hide()
                if (result.status) {
                    this.$router.push({name: 'task'})
                    this.$toast.success(result.message);
                } else {
                    this.$toast.error(result.message);
                }
            } catch(error) {
                if (this.loading != null)
                    this.loading.hide()
                this.fetch = false

                let message = error.message || error.code
                this.$toast.error(message);
            }
        },
        async calculatePriority() {
            if (this.form.deadline) {
                const now = new Date();
                const deadline = new Date(this.form.deadline);
                const diffTime = Math.abs(deadline - now);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays <= 1) {
                    this.form.prioritas = 'urgent';
                } else if (diffDays <= 3) {
                    this.form.prioritas = 'high';
                } else if (diffDays <= 5) {
                    this.form.prioritas = 'medium';
                } else {
                    this.form.prioritas = 'low';
                }
            } else {
                this.form.prioritas = '';
            }
        }
    }
}
</script>