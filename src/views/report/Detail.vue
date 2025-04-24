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
                                                <div class="bg-light custom-rounded-medium px-3 py-2 h6">Cecep Rokani</div>
                                            </div>
                                            <div class="col-md-6">
                                                <label>Penerima Tugas</label>
                                                <div class="bg-light custom-rounded-medium px-3 py-2 h6">Aldy Wijaya Gustian</div>
                                            </div>
                                        </div>
                                        <div class="form-group mb-3">
                                            <label>Deskripsi Tugas</label>
                                            <div class="bg-light custom-rounded-medium px-3 py-2 h6 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged</div>
                                        </div>
                                        <div class="form-group mb-2 row">
                                            <div class="col-md-6">
                                                <label>Prioritas</label>
                                                <div class="bg-light custom-rounded-medium px-3 py-2 h6 fw-bold">URGENT</div>
                                            </div>
                                            <div class="col-md-6">
                                                <label>Status</label>
                                                <div class="bg-light custom-rounded-medium px-3 py-2 h6 fw-bold">SEDANG DIKERJAKAN</div>
                                            </div>
                                        </div>
                                        <div class="form-group mb-3">
                                            <label>Deadline</label>
                                            <div class="bg-light custom-rounded-medium px-3 py-2 h5 fw-bold">02 Mei 2025 08:00</div>
                                        </div>
                                        <div class="form-group mb-3">
                                            <label>Catatan Tugas</label>
                                            <div class="bg-light custom-rounded-medium px-3 py-2 h6 lh-base">Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged</div>
                                        </div>
                                    </div>
                                    <div class="card-footer card-footer-custom-radius-medium bg-white">
                                        <div class="d-grid">
                                            <button type="submit" class="btn btn-primary custom-rounded-medium p-2 mb-2" @click="changeStatus">Selesaikan Tugas Ini</button>
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
        }
    },
    async mounted() {
    },
    methods: {
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
                            
                            // const response = await ApiCore.delete(apiEndPoint.TRANSACTION, data.trx_id)

                            // if (response.status) {
                            //     this.fetchData(1)
                            //     this.$toast.success(response.message);
                            // } else {
                            //     this.$toast.error(response.message);
                            // }
                        } catch(error) {
                            this.$toast.error(error);
                        }
                    }
                });
        },
    }
}
</script>