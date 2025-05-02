import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore }                from '@/store/auth';

// Layouts
import PublicLayout  from '@/components/layout/PublicLayout.vue';
import AuthLayout    from '@/components/layout/AuthLayout.vue';
import AdminLayout   from '@/components/layout/AdminLayout.vue';

// Views
import Home          from '@/views/public/Home.vue';
//import About         from '@/views/public/About.vue';
import Login         from '@/views/auth/Login.vue';
import Register      from '@/views/auth/Register.vue';
//import DashboardUser from '@/views/user/DashboardUser.vue';
//import DashboardAdmin from '@/views/admin/DashboardAdmin.vue';

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '',      name: 'home',  component: Home }
      //{ path: 'about', name: 'about', component: About }
    ]
  },
  {
    path: '/',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      { path: 'login',    name: 'login',    component: Login },
      { path: 'register', name: 'register', component: Register }
    ]
  }
  /*{
    path: '/app',
    component: PublicLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', name: 'dashboard', component: DashboardUser }
    ]
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      { path: 'dashboard', name: 'admin.dashboard', component: DashboardAdmin }
    ]
  }*/
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  if (auth.token && !auth.user) {
    try { await auth.fetchUser(); }
    catch { auth.logout(); }
  }

  if (to.meta.requiresAuth && !auth.isLogged)
    return next({ name: 'login' });

  if (to.meta.guestOnly && auth.isLogged)
    return next({ name: 'dashboard' });

  if (to.meta.requiresAdmin && !auth.isAdmin)
    return next({ name: 'dashboard' });

  next();
});

export default router;
