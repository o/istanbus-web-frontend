import Vue from 'vue'
import VueRouter from 'vue-router'
import BusSearch from '../views/BusSearch.vue'
import BusDetails from '../views/BusDetails.vue'
import StopSearch from '../views/StopSearch.vue'
import StopDetails from '../views/StopDetails.vue'
import RoutePlanner from '../views/RoutePlanner.vue'
import ClosestStop from '../views/ClosestStop.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'BusSearch',
    component: BusSearch
  },
  {
    path: '/stop-search',
    name: 'StopSearch',
    component: StopSearch
  },
  {
    path: '/bus/:id',
    name: 'BusDetails',
    component: BusDetails
  },
  {
    path: '/stop/:id',
    name: 'StopDetails',
    component: StopDetails
  },
  {
    path: '/route-planner',
    name: 'RoutePlanner',
    component: RoutePlanner
  },
  {
    path: '/closest-stop',
    name: 'ClosestStop',
    component: ClosestStop
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
