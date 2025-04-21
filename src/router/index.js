import { createRouter, createWebHashHistory } from 'vue-router'

import apiEndPoint from '@/services/api-endpoint'
import ApiCore from '@/services/core'

import Home from '../views/Home.vue'
import Signin from '../views/authentication/Signin.vue'

import ManageUser from '../views/manage-users/List.vue'
import ManageUserForm from '../views/manage-users/Form.vue'

import Task from '../views/task/List.vue'
import TaskForm from '../views/task/Form.vue'
import TaskDetail from '../views/task/Detail.vue'

import NotFound from '../views/404.vue'

import Profile from '../views/Profile.vue'
import ChangePassword from '../views/ChangePassword.vue'
import stores from '@/stores'

const nameApplication = import.meta.env.VITE_APP_TITLE

const routes = [
    // routes general
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            title: `${nameApplication} | Home`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/notfound',
        name: 'notfound',
        component: NotFound,
        meta: {
            title: `${nameApplication} | Not Found`,
            footer: false,
            navbar: false,
        }
    },
    {
        path: '/signin',
        name: 'signin',
        component: Signin,
        meta: {
            title: `${nameApplication} | Login`,
            footer: false,
            navbar: false,
        }
    },
    {
        path: '/profile',
        name: 'profile',
        component: Profile,
        meta: {
            title: `${nameApplication} | Profile`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/manage-users',
        name: 'manage-users',
        component: ManageUser,
        meta: {
            title: `${nameApplication} | Data ManageUser`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/manage-users/form/:id?',
        name: 'manage-users.form',
        component: ManageUserForm,
        meta: {
            title: `${nameApplication} | Form Data ManageUser`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/task',
        name: 'task',
        component: Task,
        meta: {
            title: `${nameApplication} | Data Tugas`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/task/form/:id?',
        name: 'task.form',
        component: TaskForm,
        meta: {
            title: `${nameApplication} | Form Data Tugas`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/task/detail/:id?',
        name: 'task.detail',
        component: TaskDetail,
        meta: {
            title: `${nameApplication} | Detail Data Tugas`,
            footer: true,
            navbar: true,
        }
    },
    {
        path: '/change-password',
        name: 'changepassword',
        component: ChangePassword,
        meta: {
            title: `${nameApplication} | Ubah Password`,
            footer: true,
            navbar: true,
        }
    },
]

const router = createRouter({
    history: createWebHashHistory(),
    routes: routes,
    linkActiveClass: 'active-link',
    scrollBehavior() {
        return { top: 0, left: 0 }
    }
})

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;

    const localData = localStorage.getItem('token')
    const tmpRole = localStorage.getItem('role') || ''

    const authRequired  = ['signin', 'signup'].includes(to.name);
    const role = to.meta.role || ''

    let isAllow = true

    if (role) {
        if (role != tmpRole)
            isAllow = false
    }

    if (isAllow) {
        if (localData) { 
            // Jika token ada
            if (!authRequired) {
                // ApiCore.get(`${apiEndPoint.ACCOUNT}/info`)
                //     .then((response) => {
                //         if ('status' in response && !response.status) {
                //             localStorage.removeItem('token');
                //             next({ name: 'home' }); // Arahkan ke home jika token tidak valid
                //         } else {
                //             stores.commit('setuser', response.data);
                //             next(); // Lanjut ke halaman yang dituju
                //         }
                //     })
                //     .catch(() => {
                //         next({ name: 'signin' }); // Jika ada error saat validasi token, arahkan ke signin
                //     });
                stores.commit('setuser', 
                    {
                        "id": 1,
                        "username": "superadmin@gmail.com",
                        "name": "Super Admin",
                        "role": "superadmin",
                        "logged_in": true
                    });
                next(); // Lanjut ke halaman yang dituju
            } else {
                next(); // Jika halaman tidak memerlukan autentikasi, lanjutkan
            }
        } else {
            // Jika token tidak ada
            if (authRequired) {
                next(); // Jika halaman adalah signin/signup, biarkan
            } else if (to.name !== 'signin') { 
                // Pastikan kita tidak mengarahkan dari signin ke signin
                next({ name: 'signin' }); // Arahkan ke halaman signin jika token tidak ada
            } else {
                next(); // Jika sudah di halaman signin, biarkan
            }
        }

        if (localStorage.getItem('show-menu') == '0') {
            document.body.classList.add('sidebar-enable')
            document.body.classList.add('vertical-collpsed')
        } if (window.innerWidth < 994) {
            document.body.classList.remove('sidebar-enable')
            document.body.classList.remove('vertical-collpsed')
        }
    } else {
        next({name: 'notfound'})
    }
})

export default router
