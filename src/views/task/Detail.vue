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
                                            <div class="bg-light custom-rounded-medium px-3 py-2 h6 lh-base">{{ detail.catatan || '-' }}</div>
                                        </div>
                                    </div>
                                    <div class="card-footer card-footer-custom-radius-medium bg-white">
                                        <div class="d-grid">
                                            <template v-if="['progress', 'todo'].indexOf(detail.status) != -1">
                                                <button type="button" class="btn btn-success custom-rounded-medium p-2 mb-2" @click="updateStatus('done')" v-if="detail.status == 'progress'">SELESAIKAN TUGAS INI</button>
                                                <button type="button" class="btn btn-primary custom-rounded-medium p-2 mb-2" @click="updateStatus('progress')" v-if="detail.status == 'todo'">KERJAKAN TUGAS INI</button>
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
                                            <template v-if="discussion.length">
                                                <div>Kolom Komentar <span v-if="discussion.length">({{ discussion.length }} pesan)</span></div>
                                                <div class="spacer-medium"></div>
                                                <div class="d-block" style="max-height: 250px; overflow-y: auto;" v-if="discussion.length" :class="{'pe-4': discussion.length > 5}" ref="contentMessage">
                                                    <div class="d-flex" v-for="item in discussion" :class="{'justify-content-start': !item.is_own, 'justify-content-end': item.is_own}">
                                                        <div class="d-block custom-rounded-medium border px-3 py-2" style="width: fit-content;" :class="{'bg-white': !item.is_own, 'bg-primary text-white text-end': item.is_own, 'mb-3': discussion.length > 1}">
                                                            <div class="font-size-12 mb-2" :class="{'text-white': item.is_own, 'text-muted': !item.is_own}">{{ $changeFormatDate(item.created_at) }}</div>
                                                            <div class="mb-2 font-size-14 fw-bold">{{ item.pesan }}</div>
                                                            <div class="font-size-12">{{ item.nama_user }}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </template>
                                            <div class="d-flex text-muted justify-content-center my-4" v-else>
                                                Belum ada komentar pada tugas
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card-footer card-footer-custom-radius-medium bg-white">
                                        <div class="d-grid">
                                            <textarea class="form-control mb-3" placeholder="Masukan komentar disini ..." rows="4" v-model="message"></textarea>
                                            <button type="submit" class="btn btn-primary custom-rounded-medium p-2 mb-2" @click="saveDiscussion" :disabled="!message">KIRIM KOMENTAR</button>
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
            detail: {},
            discussion: [],
            message: '',
            intervalId: null
        }
    },
    mounted() {
        this.intervalId = setInterval(() => {
            this.fetchDataDiscussion(false)
        }, 2000);

        this.fetchData()
    },
    beforeDestroy() {
        clearInterval(this.intervalId);
    },
    unmounted() {
        clearInterval(this.intervalId);
    },
    methods: {
        async fetchData() {
            ApiCore.get(`${apiEndPoint.TASK}/detail`, {id: this.$route.params.id}).then((result) => {
                if (result.status) {
                    this.detail = result.data
                }
            })
        },
        async updateStatus(status) {
            // menghapus data admin
            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    html: status == 'progress' ? `Kamu akan mengerjakan tugas ini` : 'Kamu akan menyelesaikan tugas ini',
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
                                if (status == 'progress')
                                    this.fetchData()
                                else
                                    this.$router.push({name: 'task'})

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
        async fetchDataDiscussion(withLoader=true) {
            ApiCore.get(`${apiEndPoint.TASK}/discussion`, {tugas_id: this.$route.params.id}, withLoader).then((result) => {
                if (result.status) {
                    this.discussion = result.data
                }
            })
        },
        async saveDiscussion() {
            const response = await ApiCore.store(`${apiEndPoint.TASK}/save-discussion`, {tugas_id: this.$route.params.id, pesan: this.message})

            if (response.status) {
                this.discussion.push({
                    pesan: this.message,
                    nama_user: this.$store.state.user.name,
                    is_own: true,
                    created_at: new Date()
                })
                this.message = null
                setTimeout(() => {
                    this.scrollToTop()
                }, 500);
            } else {
                this.$toast.error(response.message);
            }
        },
        scrollToTop() {
            const el = this.$refs.contentMessage;
            el.scrollTo({
                top: el.scrollHeight,
                behavior: 'smooth'
            });
        }
    }
}
</script>