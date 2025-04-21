<template>
    <div class="vertical-menu">
        <div id="sidebar-menu">
                <!-- Left Menu Start -->
                <ul class="metismenu list-unstyled" id="side-menu">
                    <li class="menu-title text-white">Daftar Menu</li>
                    <template v-for="(item,index) in listMenu">
                        <li :key="index" class="py-1" :class="{'mm-active': item.is_open === 1}" v-if="item.role.indexOf($store.state.user?.role?.toLowerCase()) != -1 || item.role == 'all'">
                            <template v-if="item.child?.length > 0">
                                <a href="javascript: void(0)" class="has-arrow waves-effect" :class="{'active': item.is_open === 1 && item.child?.length == 0}" @click="toggleMenu(index)">
                                    <i :class="item.icon" class="me-1"></i>
                                    <span>{{item.title}}</span>
                                </a>
                                <ul class="sub-menu" :class="{'mm-collapse': !item.is_open, 'mm-show': item.is_open === 1}" aria-expanded="true">
                                    <template v-for="subMenu in item.child">
                                        <li v-if="subMenu.role.indexOf($store.state?.user?.role?.toLowerCase()) != -1 || subMenu.role == 'all'"><router-link :to="subMenu.url" @click="openMenu(index)" :class="{'active': isSubMenuActive(subMenu)}"><span>{{subMenu.title}}</span></router-link></li>
                                    </template>
                                </ul>
                            </template>
                            <router-link :to="item.url" class="waves-effect" :class="{'active': item.is_open === 1}" v-else  @click="openMenu(index)">
                                <i :class="item.icon" class="me-1"></i>
                                <!-- <span class="badge rounded-pill bg-primary float-end">3</span> -->
                                <span>{{item.title}}</span>
                            </router-link>
                        </li>
                    </template>
                </ul>
        </div>
    </div>
</template>
<script>
import { map, filter } from 'lodash'

import { watchEffect } from 'vue';
import { useRoute } from 'vue-router';

import { reactive } from 'vue';

export default {
    name: 'SidebarMenu',
    data() {
        return {
        }
    },
    computed: {
        isSubMenuActive() {
            return (data) => {
                return filter(this.$route.path.split('/'))[0] == data.url.replace('/', '')
            }
        }
    },
    setup() {
        const route = useRoute();
        
        let listMenu = reactive([
                {
                    title: 'Dashboard',
                    icon: 'mdi mdi-view-dashboard-outline',
                    url: '/',
                    role: 'all',
                },
                {
                    title: 'Kelola Pengguna',
                    icon: 'mdi mdi-account-group-outline',
                    url: '/manage-users',
                    role: ['superadmin'],
                },
                {
                    title: 'Daftar Tugas',
                    icon: 'mdi mdi-clipboard-list-outline',
                    url: '/task',
                    role: ['superadmin'],
                },
                {
                    title: 'Laporan Tugas',
                    icon: 'mdi mdi-file-document-multiple-outline',
                    url: '/notfound',
                    role: ['superadmin'],
                },
                // {
                //     title: 'Tagihan',
                //     icon: 'mdi mdi-file-document-outline',
                //     url: '/transaction',
                //     role: ['superadmin', 'admin', 'staff'],
                // },
            ])

        const urlContained = (index) => {
            const searchKeySubmenu = filter(map(listMenu[index].child, 'url')).indexOf(`/${filter(route.path.split('/'))[0]}`)

            return searchKeySubmenu !== -1;
        }

        const initMenu = () => {
            listMenu.forEach((element, index) => {
                element.is_open = 0
            });
            listMenu.forEach((element, index) => {
                if (element.child?.length > 0) {
                    element.is_open = urlContained(index) ? 1 : 0
                } else {
                    let isOpen = 0
                    if (filter(route.path.split('/'))[0] == element.url.replace('/', '') || route.path == element.url)
                        isOpen = 1

                    element.is_open = isOpen
                }
            });
        }

        watchEffect(() => {
            console.log('Current path:', route.name);

            setTimeout(() => {
                if (route.name) {
                    initMenu()
                }
            }, 500);
        });

        return {
            listMenu,
            initMenu
        }
    },
    mounted() {
        this.initMenu()
    },
    methods: {
        openMenu(index) {
            this.listMenu.forEach((element) => {
                element.is_open = 0
            });
            
            setTimeout(() => {
                const curMenu = this.listMenu[index]
                this.listMenu.splice(index, 1, {...curMenu, is_open: 1})
            }, 100);
        },
        toggleMenu(index) {
            const curMenu = this.listMenu[index]
            this.listMenu.splice(index, 1, {...curMenu, is_open: curMenu.is_open ? 0 : 1})
        }
    }
}
</script>