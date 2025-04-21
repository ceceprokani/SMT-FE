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
                                                <label class="form-label">Password Baru</label>
                                                <div style="position: relative;">
                                                    <Field :type="togglePasswordVisibility[1] ? 'text' : 'password'" name="password" class="form-control" placeholder="Masukkan password" v-model="form.password" />
                                                    <i class="mdi" v-if="form.password" :class="{'mdi-eye': togglePasswordVisibility[1], 'mdi-eye-off': !togglePasswordVisibility[1]}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility[1] = !togglePasswordVisibility[1]"></i>
                                                </div>
                                                <ErrorMessage name="password" :class="'text-danger'" />
                                            </div>
                                            <div class="d-flex mb-3 fw-bold" v-if="passwordStrength" :class="{'text-danger': passwordStrength.level < 2, 'text-primary': passwordStrength.level < 4, 'text-success': passwordStrength.level >= 4}">
                                                <i class="mdi me-2" :class="{'mdi-alert': passwordStrength.level < 3, 'mdi-check-circle': passwordStrength.level >= 3}"></i>
                                                <div>{{passwordStrength.message}}</div>
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Konfirmasi Password Baru</label>
                                                <div style="position: relative;">
                                                    <Field :type="togglePasswordVisibility[2] ? 'text' : 'password'" name="password_confirm" class="form-control" placeholder="Masukkan konfirmasi password" v-model="form.confirmPassword" />
                                                    <i class="mdi" v-if="form.confirmPassword" :class="{'mdi-eye': togglePasswordVisibility[2], 'mdi-eye-off': !togglePasswordVisibility[2]}" style="position: absolute; top: 10px; right: 10px; cursor: pointer" @click="togglePasswordVisibility[2] = !togglePasswordVisibility[2]"></i>
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

import { useRoute } from 'vue-router';

import axios from 'axios';

export default {
    name: 'Profile',
    data() {
        return {
            togglePasswordVisibility: [false, false, false],
            form :{
                password: '',
                confirmPassword: '',
            },
            loading: null
        }
    },
    components: {
        Field, Form, ErrorMessage
    },
    setup() {
        const route = useRoute();
        
        const schema = yup.object({
            password: !route.params.id ? yup.string().required('Masukkan password').min(8, 'Password minimal 8 karakter') : null,
            password_confirm: !route.params.id ? yup.string().required('Masukkan konfirmasi password').min(8, 'Password minimal 8 karakter') : null,
        });

        const api = axios.create({
            timeout: 30000,
        });

        return {
            schema,
            api
        }
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
                        if (this.form.password != this.form.confirmPassword) {
                            this.$toast.error('Konfirmasi password tidak sesuai!');
                        } else {
                            this.api
                                .post(`${import.meta.env.VITE_APP_API_ENDPOINT}/api/update-password`,
                                    {
                                        password: this.form.password
                                    },
                                    {
                                        headers: {
                                            Authorization: `Bearer ${localStorage.getItem('token')}`, // Kirim token untuk verifikasi
                                        },
                                    }
                                )
                                .then((response) => {
                                    this.loading.hide()
                                    if (response.statusText.toLowerCase() === 'ok' || response.status === 200) {
                                        this.$toast.success(response.data.message);

                                        setTimeout(async () => {
                                            localStorage.removeItem('token')
                                            this.$router.push("/signin");
                                        }, 500);
                                    } else {
                                        this.$toast.error(response.data.message);
                                    }
                                })
                                .catch((error) => {
                                    this.loading.hide()
                                    this.$toast.error(error.response.data.error);
                                });
                        }
                    }
                });
        },
    }
}
</script>