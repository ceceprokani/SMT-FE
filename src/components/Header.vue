<template>
    <header id="page-topbar">
        <div class="navbar-header">
            <div class="d-flex">
                <!-- LOGO -->
                <div class="navbar-brand-box text-center">
                    <router-link to="/" class="logo logo-dark">
                        <span class="logo-sm">
                            <img src="@/assets/images/logo/logo-small.png" alt="logo-sm-dark" height="20">
                        </span>
                        <span class="logo-lg">
                            <img src="@/assets/images/logo/logo-horizontal.png" alt="logo-dark" height="50">
                        </span>
                    </router-link>
                </div>

                <button type="button" class="btn btn-sm px-3 font-size-24 header-item waves-effect" id="vertical-menu-btn" @click="toggleMenu">
                    <i class="ri-menu-2-line align-middle"></i>
                </button>
            </div>
            <div class="d-flex">
                <div class="dropdown d-inline-block">
                    <button type="button" class="btn header-item noti-icon waves-effect" id="page-header-notifications-dropdown"
                        data-bs-toggle="dropdown" aria-expanded="false">
                        <i class="ri-notification-3-line"></i>
                        <span class="noti-dot"></span>
                    </button>
                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-end p-0"
                        aria-labelledby="page-header-notifications-dropdown">
                        <div class="p-3">
                            <div class="row align-items-center">
                                <div class="col">
                                    <h6 class="m-0"> Notifications </h6>
                                </div>
                                <div class="col-auto">
                                    <a href="#!" class="small"> View All</a>
                                </div>
                            </div>
                        </div>
                        <div class="p-2 border-top">
                            <div class="d-grid">
                                <a class="btn btn-sm btn-link font-size-14 text-center" href="javascript:void(0)">
                                    <i class="mdi mdi-arrow-right-circle me-1"></i> View More..
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="dropdown d-inline-block user-dropdown">
                    <button type="button" class="btn header-item waves-effect" id="page-header-user-dropdown"
                        data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <img class="rounded-circle header-profile-user" src="@/assets/images/default-avatar.png" alt="Header Avatar">
                        <span class="d-none d-xl-inline-block mx-2">{{$store.state.user?.name}}</span>
                        <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
                    </button>
                    <div class="dropdown-menu dropdown-menu-end">
                        <!-- item-->
                        <a class="dropdown-item" href="#"><i class="ri-user-line align-middle me-1"></i> Profile</a>
                        <router-link class="dropdown-item" :to="'/change-password'"><i class="ri-lock-line align-middle me-1"></i> Ubah Password</router-link>
                        <div class="dropdown-divider"></div>
                        <button class="dropdown-item text-danger" @click="logout"><i class="ri-shut-down-line align-middle me-1 text-danger"></i> Logout</button>
                    </div>
                </div>
            </div>
        </div>
    </header>
</template>
<script>
export default {
    name: 'NavBar',
    data() {
        return {
        }
    },
    methods: {
        async logout() {
            this.$swal
                .fire({
                    title: 'Apakah kamu yakin ?',
                    text: 'Kamu akan keluar dari aplikasi',
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
                        this.$store.getters.logout
                        window.location.href='/'
                    }
                });
        },
        toggleMenu() {
            document.body.classList.toggle('sidebar-enable')
            document.body.classList.toggle('vertical-collpsed')
            
            const isShowMenu = localStorage.getItem('show-menu')
            
            localStorage.setItem('show-menu', isShowMenu == 1 ? 0 : 1)
        }
    }
}
</script>