<template>
    <main>
        <div id="layout-wrapper">
            <div class="main-content">
                <div class="page-content">
                    <div class="container-fluid">
                        <!-- title of page -->
                        <div class="row justify-content-center">
                            <div class="col-6 mt-3">
                                <div class="page-title-box d-sm-flex align-items-center justify-content-between">
                                    <h4 class="mb-sm-0">Ubah Password</h4>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-6">
                                <Form :validation-schema="schema" @submit="handleSubmit">
                                    <div class="card custom-rounded-medium">
                                        <div class="card-body">
                                            <h6 class="mb-3">Silahkan masukkan password anda yang baru.</h6>
                                            <div class="spacer-medium"></div>
                                            <div class="form-group" :class="{'mb-2': passwordStrength, 'mb-3': !passwordStrength}">
                                                <label class="form-label">Password</label>
                                                <div style="position: relative;">
                                                    <Field :type="togglePasswordVisibility[0] ? 'text' : 'password'" name="new_password" class="form-control" placeholder="Masukkan password" v-model="form.new_password" />
                                                    <i class="mdi" v-if="form.new_password" :class="{'mdi-eye': togglePasswordVisibility[0], 'mdi-eye-off': !togglePasswordVisibility[0]}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility[0] = !togglePasswordVisibility[0]"></i>
                                                </div>
                                                <ErrorMessage name="new_password" :class="'text-danger'" />
                                            </div>
                                            <div class="d-flex mb-3 fw-bold" v-if="passwordStrength" :class="{'text-danger': passwordStrength.level < 2, 'text-primary': passwordStrength.level <= 4, 'text-success': passwordStrength.level >= 5}">
                                                <i class="mdi me-2" :class="{'mdi-alert': passwordStrength.level < 5, 'mdi-check-circle': passwordStrength.level >= 5}"></i>
                                                <div>{{passwordStrength.message}}</div>
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Konfirmasi Password</label>
                                                <div style="position: relative;">
                                                    <Field :type="togglePasswordVisibility[1] ? 'text' : 'password'" name="confirm_password" class="form-control" placeholder="Masukkan konfirmasi password" v-model="form.confirm_password" />
                                                    <i class="mdi" v-if="form.confirm_password" :class="{'mdi-eye': togglePasswordVisibility[1], 'mdi-eye-off': !togglePasswordVisibility[1]}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility[1] = !togglePasswordVisibility[1]"></i>
                                                </div>
                                                <ErrorMessage name="confirm_password" :class="'text-danger'" />
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
                                        <div class="card-footer card-footer-custom-radius-medium">
                                            <div class="d-flex justify-content-end">
                                                <button type="button" @click="$router.push('/')" class="btn border-light bg-white custom-rounded-medium me-2">Kembali</button>
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
    name: 'Profile',
    data() {
        return {
            togglePasswordVisibility: [false, false, false],
            form :{
                new_password: '',
                confirm_password: '',
            },
            loading: null
        }
    },
    components: {
        Field, Form, ErrorMessage
    },
    setup() {
        const schema = yup.object({
            new_password: yup.string().required('Masukkan password'),
            confirm_password: yup.string().required('Masukkan konfirmasi password').min(8, 'Masukkan password minimal 8 karakter'),
        });

        return {
            schema,
        }
    },
    computed: {
        passwordStrength() {
            const rules = [
                { regex: /.{8,}/, message: 'Password minimal 8 karakter', level: 1 },
                { regex: /[a-z]/, message: 'Password harus mengandung huruf kecil (a-z)', level: 2 },
                { regex: /[A-Z]/, message: 'Password harus mengandung huruf besar (A-Z)', level: 3 },
                { regex: /[0-9]/, message: 'Password harus mengandung angka (0-9)', level: 4 },
                { regex: /[\W_]/, message: 'Password harus mengandung simbol', level: 5 }
            ];

            if (this.form.new_password) {
                let passed = 0;
                let failedRule = null;
                for (let i = 0; i < rules.length; i++) {
                    if (rules[i].regex.test(this.form.new_password)) {
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
    },
    methods: {
        async handleSubmit() {
            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    html: `Kamu akan mengubah password`,
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
                            if (this.passwordStrength && this.passwordStrength.level < 5) {
                                this.$toast.error(this.passwordStrength.message);
                                return;
                            } if (this.form.new_password && this.form.new_password !== this.form.confirm_password) {
                                this.$toast.error('Konfirmasi password tidak sesuai!');
                                return;
                            }
            
                            this.loading = this.$loading.show()
                            const result = await ApiCore.store(`${apiEndPoint.ACCOUNT}/change-password`, {...this.form})
                            this.fetch = false
                            if (result.status) {
                                this.$toast.success(result.message);
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
                    }
                });
        },
    }
}
</script>