<script setup>
import Header from './components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div id="layout-wrapper" v-if="$route.meta.navbar">
    <Header></Header>
    <Sidebar></Sidebar>
    <router-view></router-view>
    <Footer></Footer>
  </div>
  <router-view v-else></router-view>
</template>