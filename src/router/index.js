import Vue from 'vue'
import VueRouter from 'vue-router'
import BusSearch from '../views/BusSearch.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'BusSearch',
    component: BusSearch
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
