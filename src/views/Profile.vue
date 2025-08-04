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
                                                <Field name="name" class="form-control custom-rounded-medium bg-white" placeholder="Masukkan nama lengkap" v-model="form.name"></Field>
                                                <ErrorMessage name="name" :class="'text-danger'" />
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Email</label>
                                                <div name="email" class="form-control custom-rounded-medium bg-light" disabled>{{ $store.state.user?.email || '-' }}</div>
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">No. Telepon</label>
                                                <Field type="text" v-mask="['+62 ###-####-####']" name="phone" class="form-control custom-rounded-medium" placeholder="+62 878-xxxx-xxxx" v-model="form.phone" />
                                                <ErrorMessage name="phone" :class="'text-danger'" />
                                            </div>
                                            <div class="form-group mb-3">
                                                <label class="form-label">Alamat</label>
                                                <textarea name="address" class="form-control custom-rounded-medium bg-white" rows="5" style="height: 200px" v-model="form.address" placeholder="Masukan alamat"></textarea>
                                            </div>
                                        </div>
                                        <div class="card-footer card-footer-custom-radius-medium">
                                            <div class="d-flex justify-content-end">
                                                <button @click="$router.push('/')" class="btn border-light bg-white custom-rounded-medium">Kembali</button>
                                                <button type="submit" class="btn btn-primary custom-rounded-medium ms-2">Simpan</button>
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
import { useRoute } from 'vue-router';

import { Field, Form, ErrorMessage } from 'vee-validate';
import * as yup from 'yup';

import apiEndPoint from '@/services/api-endpoint'
import ApiCore from '@/services/core'

export default {
    name: 'Profile',
    data() {
        return {
            form :{
                name: '',
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
        this.form.phone = this.dataUser?.phone
        this.form.address = this.dataUser?.address
    },
    components: {
        Field, Form, ErrorMessage
    },
    watch: {
        dataUser(newValue, oldValue) {
            this.form.name = newValue.name
            this.form.phone = newValue.phone
            this.form.address = newValue.address
        },
    },
    setup() {
        const route = useRoute();
        
        const schema = yup.object({
            name: yup.string().required('Masukkan nama'),
            phone: yup.string().required('Masukkan no. telepon'),
        });

        return {
            schema,
        }
    },
    methods: {
        async handleSubmit() {
            try {
                this.loading = this.$loading.show()
                const result = await ApiCore.store(`${apiEndPoint.ACCOUNT}/profile/update`, {...this.form})
                this.fetch = false
                this.loading.hide()
                if (result.status) {
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
    }
}
</script>