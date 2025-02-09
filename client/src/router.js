import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from './state/user'

// Lazy load components
const Welcome = () => import('./components/Welcome.vue')
const Dashboard = () => import('./components/Dashboard.vue')
const Missions = () => import('./components/Missions.vue')
const Outcomes = () => import('./components/Outcomes.vue')
const Agent = () => import('./components/Agent.vue')
const Assets = () => import('./components/Assets.vue')
const Profile = () => import('./components/Profile.vue')
const Comms = () => import('./components/Comms.vue')

const routes = [
  {
    path: '/',
    name: 'welcome',
    component: Welcome
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/missions',
    name: 'missions',
    component: Missions,
    meta: { requiresAuth: true }
  },
  {
    path: '/outcomes',
    name: 'outcomes',
    component: Outcomes,
    meta: { requiresAuth: true }
  },
  {
    path: '/agent',
    name: 'agent',
    component: Agent,
    meta: { requiresAuth: true }
  },
  {
    path: '/assets',
    name: 'assets',
    component: Assets,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/comms',
    name: 'comms',
    component: Comms,
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'welcome' })
  } else {
    next()
  }
})

export default router 