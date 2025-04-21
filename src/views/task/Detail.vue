<template>
    <main>
        <div id="layout-wrapper">
            <div class="main-content">
                <div class="page-content">
                    <div class="container-fluid">
                        <!-- title of page -->
                        <div class="row">
                            <div class="col-12 mt-3">
                                <div class="page-title-box d-sm-flex align-items-center">
                                    <router-link to="/master-staff" class="btn btn-square bg-white border custom-rounded-medium me-3"><i class="ri-arrow-left-s-line fs-4"></i></router-link>
                                    <h4 class="mb-sm-0">Form Data Tagihan</h4>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-5">
                                <Form ref="form" :validation-schema="schema" @submit="disbledSubmit">
                                    <div class="card custom-rounded-medium">
                                        <div class="card-header bg-white card-header-custom-radius-medium">
                                            <div class="d-flex align-items-center mt-2">
                                                <button class="btn button-circle bg-light border my-0 me-3 fw-bold fs-5">1</button>
                                                <h5 class="text-primary my-0 fw-bold">Form Tagihan</h5>
                                            </div>
                                        </div>
                                        <div class="card-body">
                                            <div class="form-group mb-4">
                                                <label class="form-label">Pelanggan</label>
                                                <Field as="select" class="form-select select-rounded padding-vertical-10" name="customer_id" v-model="form.pelanggan_id" @change="onChangeCustomer">
                                                    <option value="">Pilih Pelanggan &nbsp;</option>
                                                    <option v-for="item in listCustomer" :value="item.id">{{ item.nama }} &nbsp;</option>
                                                </Field>
                                                <ErrorMessage name="customer_id" :class="'text-danger'" />
                                            </div>
                                            <div class="form-group mb-4">
                                                <label class="form-label">Tanggal</label>
                                                <Field type="date" name="date" class="form-control custom-rounded-medium mb-2" placeholder="Pilih tanggal" v-model="form.tanggal" />
                                                <ErrorMessage name="date" :class="'text-danger'" />
                                            </div>
                                            <div class="form-group mb-4 row">
                                                <div class="col-md-6">
                                                    <label class="form-label">Meteran Awal</label>
                                                    <Field type="number" name="meteran_awal" class="form-control custom-rounded-medium mb-2" placeholder="Masukkan meteran awal" v-model="form.meteran_awal" />
                                                    <ErrorMessage name="meteran_awal" :class="'text-danger'" />
                                                </div>
                                                <div class="col-md-6">
                                                    <label class="form-label">Meteran Akhir</label>
                                                    <Field type="number" name="meteran_akhir" class="form-control custom-rounded-medium mb-2" placeholder="Masukkan meteran akhir" v-model="form.meteran_akhir" />
                                                    <ErrorMessage name="meteran_akhir" :class="'text-danger'" />
                                                </div>
                                            </div>
                                        </div>
                                        <div class="card-footer card-footer-custom-radius-medium">
                                            <div class="d-grid">
                                                <button type="submit" class="btn btn-primary custom-rounded-medium p-2" @click="validateBeforeSubmit">Simulasikan Tagihan</button>
                                            </div>
                                        </div>
                                    </div>
                                </Form>
                            </div>
                            <div class="col-md-1 d-flex align-items-center justify-content-center flex-column">
                                <div class="mb-4"><i class="mdi mdi-arrow-right fs-3 text-muted"></i></div>
                            </div>
                            <div class="col-md-6">
                                <div class="card custom-rounded-medium">
                                    <div class="card-header bg-white card-header-custom-radius-medium">
                                        <div class="d-flex align-items-center mt-2">
                                            <button class="btn button-circle bg-light border my-0 me-3 fw-bold fs-5">2</button>
                                            <h5 class="text-primary my-0 fw-bold">Hasil Simulasi Tagihan</h5>
                                        </div>
                                    </div>
                                    <div class="card-body">
                                        <div class="row mb-3">
                                            <div class="col-md-6 flex-grow-1"><label class="fs-6">Total Meteran Bulan Ini</label></div>
                                            <div class="col-auto flex-shrink-0"><div class="fw-bold fs-5">{{ form.total_meteran }} m<sup>3</sup></div></div>
                                        </div>
                                        <div class="row mb-3">
                                            <div class="col-md-6 flex-grow-1"><label class="fs-6">Biaya Beban</label></div>
                                            <div class="col-auto flex-shrink-0"><div class="fw-bold fs-5">Rp. {{ settings.beban ? $toCurrency(settings.beban, false) : '0' }}</div></div>
                                        </div>
                                        <div class="row">
                                            <div class="col-md-6 flex-grow-1"><label class="fs-6">Jumlah Pembiayaan Meteran</label></div>
                                            <div class="col-auto flex-shrink-0"><div class="fw-bold fs-5">Rp. {{ form.total_tagihan ? $toCurrency(form.total_tagihan, false) : '0' }}</div></div>
                                        </div>
                                    </div>
                                    <div class="card-footer card-footer-custom-radius-medium bg-primary">
                                        <div class="row my-3 text-white align-items-center">
                                            <div class="col-auto flex-grow-1"><label class="fs-5 my-0">Jumlah Keseluruhan</label></div>
                                            <div class="col-auto flex-shrink-0"><div class="fw-bold fs-4">Rp. {{ form.total_tagihan_dengan_beban ? $toCurrency(form.total_tagihan_dengan_beban, false) : '0' }}</div></div>
                                        </div>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center alert alert-info custom-rounded-medium text-muted" v-if="hasCalculate">
                                    <div class="text-info me-3 pb-0">
                                        <div class="mdi mdi-information-outline fs-3"></div>
                                    </div>
                                    <div class="d-block">
                                        <div>
                                            Harga air per m<sup>3</sup>
                                        </div>
                                        <template v-for="item, index in settings.harga_air">
                                            <span class="me-2 text-dark fw-bold">Level {{ index + 1 }} : <span class="text-info fw-bold">Rp. {{ item.price ? $toCurrency(item.price, false) : '0' }} <span class="text-muted font-size-10">/</span> <span class="font-size-12">{{ item.limit }}m<sup>3</sup></span></span><span v-if="index < settings.harga_air.length" class="me-1">,</span></span>
                                        </template>
                                    </div>
                                </div>
                                <div class="d-flex align-items-center alert alert-info custom-rounded-medium text-muted" v-if="!hasCalculate">
                                    <div class="text-info me-3 pb-0">
                                        <div class="mdi mdi-information-outline fs-3"></div>
                                    </div>
                                    <div> Silahkan untuk melakukan <span class="text-info fw-bold">Simulasi Tagihan</span> terlebih dahulu untuk melakukan <span class="text-info fw-bold">Perhitungan Tagihan Air</span>. </div>
                                </div>
                                <div class="d-grid" v-else>
                                    <button type="button" @click="saveData" class="btn btn-primary custom-rounded-medium p-2">Simpan Tagihan</button>
                                </div>
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

import apiEndPoint from '@/services/api-endpoint'
import ApiCore from '@/services/core'

import axios from 'axios';
import { find } from 'lodash';
import { sumBy } from 'lodash';

export default {
    name: 'Transaction',
    data() {
        return {
            id: this.$route.params.id,
            form: {
                pelanggan_id: this.$route.params.client_id || '',
                tanggal: new Date().toISOString().split("T")[0],
                meteran_awal: '',
                meteran_akhir: '',
                total_tagihan: 0,
                total_tagihan_dengan_beban: 0,
                total_meteran: 0,
                petugas_id: this.$store.state.user?.id
            },
            settings: {
                price: 0,
                beban: 0
            },
            listCustomer: [],
            hasCalculate: false,
            loading: null,
            togglePasswordVisibility: [false, false]
        }
    },
    components: {
        Field, Form, ErrorMessage
    },
    setup() {
        const route = useRoute();
        
        const schema = yup.object({
            customer_id: yup.string().required('Pilih pelanggan'),
            date: yup.string().required('Masukkan tanggal'),
            meteran_awal: yup.string().required('Masukkan meteran awal'),
            meteran_akhir: yup.string().required('Masukkan meteran akhir'),
        })

        const api = axios.create({
            timeout: 30000,
        });

        return {
            schema,
            api
        }
    },
    async mounted() {
        this.fetchDataCustomer()
        if (this.id) {
        }
    },
    methods: {
        disbledSubmit() {
            return false
        },
        async calculate() {
            // simpan data ke database
            this.hasCalculate = true
        
            const meteranFirst = parseInt(this.form.meteran_awal)
            const meteranLast = parseInt(this.form.meteran_akhir)
            const totalMeteran = meteranLast - meteranFirst
            let tmpTotalMeteran = totalMeteran

            let listPrice = []
            let totalBill = 0
            for (const data of this.settings.harga_air) {
                const price = parseInt(data.price)
                const limit = parseInt(data.limit)
                let totalMeteranByLimit = 0
                const totalCurrentLimit = sumBy(listPrice, 'limit')
                
                if (totalMeteran > limit) {
                    console.log(totalCurrentLimit);
                    totalMeteranByLimit = Math.abs(limit - totalCurrentLimit)
                    tmpTotalMeteran -= totalMeteranByLimit
                } else {
                    totalMeteranByLimit = Math.abs(tmpTotalMeteran)
                }

                listPrice.push({price: price, limit: totalMeteranByLimit});
                totalBill += price * totalMeteranByLimit
                
                if (totalMeteran <= limit) break;
            }

            const totalBillWithFee = totalBill + this.settings.beban

            this.form.total_meteran = totalMeteran
            this.form.total_tagihan = totalBill
            this.form.total_tagihan_dengan_beban = totalBillWithFee
        },
        async validateBeforeSubmit() {
            const form = this.$refs.form; // Referensi ke <Form>
            const { valid, errors } = await form.validate(); // Validasi semua field

            if (!valid) {
                this.$toast.error(Object.values(errors).join('\n'));
                return;
            } else {
                if (parseInt(this.form.meteran_awal) == parseInt(this.form.meteran_akhir)) {
                    this.$toast.error('Meteran awal tidak boleh sama dengan meteran akhir');
                    return;
                } else if (parseInt(this.form.meteran_awal) > parseInt(this.form.meteran_akhir)) {
                    this.$toast.error('Meteran awal tidak boleh lebih besar dari meteran akhir');
                    return;
                } else {
                    await this.fetchWaterPriceByCustomer().then(() => {
                        this.calculate()
                    })
                }
            }
        },
        async saveData() {
            try {
                this.loading = this.$loading.show()
                
                const result = await ApiCore.store(`${apiEndPoint.TRANSACTION}/save`, {...this.form})
                this.fetch = false
                if (result.status) {
                    this.$router.push({name: 'transaction'})
                    this.$toast.success('Data berhasil disimpan!');
                } else {
                    this.$toast.error(result.status);
                }

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
        async fetchDataCustomer() {
            this.listCustomer = []
            ApiCore.get(apiEndPoint.MASTER_CUSTOMER).then((result) => {
                if (result.status) {
                    this.listCustomer = result.data
                }
            })
        },
        async fetchWaterPriceByCustomer() {
            return new Promise((resolve, reject) => {
                ApiCore.get(apiEndPoint.SETTING_WATER_PRICE, {
                    rwId: find(this.listCustomer, {id: this.form.pelanggan_id})?.rw
                }).then((result) => {
                    resolve(result.data[0]);
                    if (result.status) {
                        this.settings = result.data[0]
                    }
                })
                .catch((error) => {
                    reject(error);
                });
            });
        },
        onChangeCustomer() {
            this.hasCalculate = false
            this.form.total_meteran = 0
            this.settings.beban = 0
            this.form.total_tagihan = 0
            this.form.total_tagihan_dengan_beban = 0
        }
    }
}
</script>