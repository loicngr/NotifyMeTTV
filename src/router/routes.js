const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/options',
        component: () => import('pages/OptionsPage.vue')
      },
      {
        path: '/popup',
        component: () => import('pages/PopupPage.vue')
      },
      {
        path: '/devtools',
        component: () => import('pages/DevToolsPage.vue')
      }
    ]
  }
]

export default routes
