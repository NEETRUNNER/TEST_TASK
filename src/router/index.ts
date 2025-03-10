import { createRouter, createWebHistory } from 'vue-router'

import ProjectsList from '@/views/ProjectsList.vue'
import ProjectItem from '@/views/ProjectItem.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/projects' },
    { path: '/projects', component: ProjectsList },
    { path: '/projects/:name', component: ProjectItem }
  ],
})

export default router
