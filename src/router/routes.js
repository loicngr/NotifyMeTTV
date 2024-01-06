const routes = [
  {
    path: '/popup',
    component: () => import('layouts/PopupLayout.vue')
  },
  {
    path: '/options',
    component: () => import('layouts/OptionsLayout.vue')
  }
]

export default routes
