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
                                    <router-link to="/task" class="btn btn-square bg-white border custom-rounded-medium me-3"><i class="ri-arrow-left-s-line fs-4"></i></router-link>
                                    <h4 class="mb-sm-0">Detail Tugas</h4>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="card custom-rounded-medium">
                                    <div class="card-header bg-white card-header-custom-radius-medium">
                                        <h5 class="text-primary mt-3 mb-0 fw-bold">Informasi Tugas</h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="form-group mb-2 row">
                                            <div class="col-md-6">
                                                <label>Pemberi Tugas</label>
                                                <div class="bg-light custom-rounded-medium px-3 py-2 h6">{{ detail.pemberi_tugas }}</div>
                                            </div>
                                            <div class="col-md-6">
                                                <label>Penerima Tugas</label>
                                                <div class="bg-light custom-rounded-medium px-3 py-2 h6">{{ detail.penerima_tugas }}</div>
                                            </div>
                                        </div>
                                        <div class="form-group mb-3">
                                            <label>Deskripsi Tugas</label>
                                            <div class="bg-light custom-rounded-medium px-3 py-2 h6 lh-base" v-html="detail.deskripsi"></div>
                                        </div>
                                        <div class="form-group mb-2 row">
                                            <div class="col-md-6">
                                                <label>Prioritas</label>
                                                <div class="bg-light custom-rounded-medium px-3 py-2 h6 fw-bold text-uppercase">{{ detail.prioritas }}</div>
                                            </div>
                                            <div class="col-md-6">
                                                <label>Status</label>
                                                <div class="bg-light custom-rounded-medium px-3 py-2 h6 fw-bold">
                                                    <div v-if="detail.status == 'todo'">Belum Dikerjakan</div>
                                                    <div v-if="detail.status == 'progress'">Sedang Dikerjakan</div>
                                                    <div v-if="detail.status == 'done'">Berhasil Dikerjakan</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="form-group mb-3">
                                            <label>Deadline</label>
                                            <div class="bg-light custom-rounded-medium px-3 py-2 h5 fw-bold" v-if="detail.deadline">{{ $changeFormatDate(detail.deadline, 'DD MMMM YYYY') }}</div>
                                        </div>
                                        <div class="form-group mb-3">
                                            <label>Catatan Tugas</label>
                                            <div class="bg-light custom-rounded-medium px-3 py-2 h6 lh-base">{{ detail.catatan }}</div>
                                        </div>
                                    </div>
                                    <div class="card-footer card-footer-custom-radius-medium bg-white">
                                        <div class="d-grid">
                                            <template v-if="['progress', 'todo'].indexOf(detail.status) != -1">
                                                <button type="button" class="btn btn-primary custom-rounded-medium p-2 mb-2" @click="updateStatus('done')" v-if="detail.status == 'progress'">Selesaikan Tugas Ini</button>
                                                <button type="button" class="btn btn-primary custom-rounded-medium p-2 mb-2" @click="updateStatus('progress')" v-if="detail.status == 'todo'">Kerjakan Tugas Ini</button>
                                            </template>
                                            <div v-else class="alert alert-success custom-rounded-medium text-center fw-bold">
                                                TUGAS TELAH SELESAI
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="card custom-rounded-medium">
                                    <div class="card-header bg-white card-header-custom-radius-medium">
                                        <h5 class="text-primary mt-3 mb-0 fw-bold">Diskusi Tugas</h5>
                                    </div>
                                    <div class="card-body">
                                        <div class="d-block bg-light p-3 custom-rounded-medium">
                                            <div>Kolom Komentar</div>
                                            <div class="spacer-medium"></div>
                                            <div class="d-block">
                                                <div class="d-flex justify-content-start">
                                                    <div class="d-block bg-white custom-rounded-medium border p-3 mb-3" style="width: fit-content;">
                                                        <div class="text-muted font-size-12 mb-2">20 Mei 2025 20:00</div>
                                                        <div class="mb-2">Tolong kerjakan task sesuai deskripsi itugas yak</div>
                                                        <div class="font-size-12">Aldy</div>
                                                    </div>
                                                </div>
                                                <div class="d-flex justify-content-end">
                                                    <div class="d-block bg-primary custom-rounded-medium border p-3 text-white text-end" style="width: fit-content;">
                                                        <div class="font-size-12 mb-2">20 Mei 2025 20:00</div>
                                                        <div class="mb-2">Mantap Pisan Lah</div>
                                                        <div class="font-size-12">Cecep Rokani</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer card-footer-custom-radius-medium bg-white">
                                        <div class="d-grid">
                                            <textarea class="form-control mb-3" placeholder="Masukan komentar disini" rows="4"></textarea>
                                            <button type="submit" class="btn btn-primary custom-rounded-medium p-2 mb-2">Kirim Komentar</button>
                                        </div>
                                    </div>
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
import apiEndPoint from '@/services/api-endpoint'
import ApiCore from '@/services/core'

export default {
    name: 'Transaction',
    data() {
        return {
            id: this.$route.params.id,
            detail: {}
        }
    },
    async mounted() {
        if (this.id) {
            ApiCore.get(`${apiEndPoint.TASK}/detail`, {id: this.$route.params.id}).then((result) => {
                if (result.status) {
                    this.detail = result.data
                }
            })
        }
    },
    methods: {
        async updateStatus(status) {
            // menghapus data admin
            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    html: `Kamu akan mengubah status tugas ini,`,
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
                            const response = await ApiCore.store(`${apiEndPoint.TASK}/update-status`, {id: this.id, status: status})

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
        async changeStatus() {
            // menghapus data admin
            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    html: `Kamu akan <b>Menyelesaikan</b> tugas ini`,
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
                            this.$toast.success('Berhasil');
                            this.$router.push({name: 'task'})
                            
                            if (result.status) {
                                // this.fetchData(1)
                                this.$toast.success(result.message);
                            } else {
                                this.$toast.error(result.message);
                            }
                        } catch(error) {
                            this.$toast.error(error);
                        }
                    }
                });
        },
    }
}
</script>