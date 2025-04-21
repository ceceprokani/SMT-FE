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
                                    <h4 class="mb-sm-0">Profil</h4>
                                </div>
                            </div>
                        </div>
                        <div class="row justify-content-center">
                            <div class="col-md-6">
                                <Form :validation-schema="schema" @submit="handleSubmit">
                                    <div class="card custom-rounded-medium">
                                        <div class="card-body">
                                            <h6 class="mb-3">Silahkan lengkapi form dibawah ini dengan benar.</h6>
                                            <div class="spacer-medium"></div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Nama</label>
                                                <div class="form-control custom-rounded-medium bg-white" v-if="$store.state.user?.role == 'superadmin'">{{ $store.state.user?.name }}</div>
                                                <template v-else>
                                                    <Field name="name" class="form-control custom-rounded-medium bg-white" placeholder="Masukkan nama lengkap" v-model="form.name"></Field>
                                                    <ErrorMessage name="name" :class="'text-danger'" />
                                                </template>
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Email</label>
                                                <div name="name" class="form-control custom-rounded-medium bg-light" disabled>{{ $store.state.user?.email }}</div>
                                            </div>
                                            <template v-if="$store.state.user?.role != 'superadmin'">
                                                <div class="form-group mb-3">
                                                    <label class="form-label">NIK</label>
                                                    <Field type="text" v-mask="['################']" name="identity_number" class="form-control custom-rounded-medium mb-2" placeholder="Masukkan NIK" v-model="form.identity_number"/>
                                                    <div class="d-flex justify-content-between">
                                                        <div class="text-info" v-if="form.identity_number?.length">Karakter : {{ form.identity_number?.length }}</div>
                                                        <ErrorMessage name="identity_number" :class="'text-danger'" />
                                                    </div>
                                                </div>
                                                <div class="form-group mb-3">
                                                    <label class="form-label">No. Telepon</label>
                                                    <Field type="text" v-mask="['+62 ###-####-####']" name="phone" class="form-control custom-rounded-medium" placeholder="+62 878-xxxx-xxxx" v-model="form.phone" />
                                                    <ErrorMessage name="phone" :class="'text-danger'" />
                                                </div>
                                                <div class="form-group mb-3">
                                                    <label class="form-label">Alamat</label>
                                                    <textarea name="address" class="form-control custom-rounded-medium bg-white" rows="5" style="height: 200px" v-model="form.address"></textarea>
                                                </div>
                                            </template>
                                        </div>
                                        <div class="card-footer card-footer-custom-radius-medium">
                                            <div class="d-flex justify-content-end">
                                                <button @click="$router.push('/')" class="btn border-light bg-white custom-rounded-medium">Kembali</button>
                                                <button type="submit" class="btn btn-primary custom-rounded-medium ms-2" v-if="$store.state.user?.role != 'superadmin'">Simpan</button>
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
            form :{
                name: '',
                identity_number: '',
                phone: '',
                address: '',
            },
            loading: null
        }
    },
    computed: {
        dataUser() {
            return this.$store.state.user
        }
    },
    mounted() {
        this.form.name = this.dataUser?.name
        this.form.identity_number = this.dataUser?.identity_number
        this.form.phone = this.dataUser?.phone
        this.form.address = this.dataUser?.address
    },
    components: {
        Field, Form, ErrorMessage
    },
    watch: {
        dataUser(newValue, oldValue) {
            this.form.name = newValue.name
            this.form.identity_number = newValue.identity_number
            this.form.phone = newValue.phone
            this.form.address = newValue.address
        },
    },
    setup() {
        const route = useRoute();
        
        const schema = yup.object({
            name: !route.params.id ? yup.string().required('Masukkan nama') : null,
            phone: !route.params.id ? yup.string().required('Masukkan no. telepon') : null,
            identity_number: !route.params.id ? yup.string().required('Masukkan nik').min(16, 'NIK minimal 16 karakter').max(16, 'NIK maksimal 16 karakter') : null,
        });

        const api = axios.create({
            timeout: 30000,
        });

        return {
            schema,
            api
        }
    },
    methods: {
        async handleSubmit() {
            try {
                this.loading = this.$loading.show()
                
                this.loading.hide()
                this.$toast.success('Profil Berhasil Disimpan');
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