// src/router/index.js (corregido)
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '@/store/auth';

// Layouts
import PublicLayout from '@/components/layout/PublicLayout.vue';
import AuthLayout from '@/components/layout/AuthLayout.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';

// Public Views
import Home from '@/views/public/Home.vue';
import RoomDetail from '@/views/public/RoomDetail.vue';
import Login from '@/views/auth/Login.vue';
import Register from '@/views/auth/Register.vue';
import Booking from '@/views/user/Booking.vue';
//import UserDashboard from '@/views/user/UserDashboard.vue';

// Admin Views
import AdminDashboard from '@/views/admin/Dashboard/AdminOverview.vue';
import ReservationsList from '@/views/admin/reservations/ReservationsList.vue';
import RoomsList from '@/views/admin/rooms/RoomsList.vue';
import UserLayout from '@/components/layout/UserLayout.vue';

const routes = [
  // Public routes
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'home', component: Home },
      { path: 'room/:id', name: 'room-detail', component: RoomDetail },
      //{ path: 'rooms', name: 'rooms', component: () => import('@/views/public/RoomsList.vue') },
      //{ path: 'about', name: 'about', component: () => import('@/views/public/About.vue') },
      //{ path: 'contact', name: 'contact', component: () => import('@/views/public/Contact.vue') },
    ]
  },
  
  // Auth routes
  {
    path: '/',
    component: AuthLayout,
    meta: { guestOnly: true },
    children: [
      { path: 'login', name: 'login', component: Login },
      { path: 'register', name: 'register', component: Register },
      //{ path: 'forgot-password', name: 'forgot-password', component: () => import('@/views/auth/ForgotPassword.vue') },
      //{ path: 'reset-password', name: 'reset-password', component: () => import('@/views/auth/ResetPassword.vue') }
    ]
  },
  
  // User routes (protected)
  {
    path: '/app',
    component: UserLayout,
    //meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'user.dashboard',
        component: AdminDashboard
      },
      // Reservations routes
      {
        path: 'reservations',
        name: 'user.reservation',
        component: ReservationsList
      },
      
      // Rooms routes
      {
        path: 'rooms',
        name: 'user.room',
        component: RoomsList
      },

      {
        path: 'services',
        name: 'user.services',
        component: RoomsList
      },

      {
        path: 'orders',
        name: 'user.orders',
        component: RoomsList
      },

      {
        path: 'profile',
        name: 'user.profile',
        component: RoomsList
      },

      {
        path: 'support',
        name: 'user.support',
        component: RoomsList
      },
      
    ]
  },
  
  // Admin routes
  {
    path: '/admin',
    component: AdminLayout,
    //meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'admin.dashboard',
        component: AdminDashboard
      },
      // Reservations routes
      {
        path: 'reservations',
        name: 'admin.reservations',
        component: ReservationsList
      },
      
      // Rooms routes
      {
        path: 'rooms',
        name: 'admin.rooms',
        component: RoomsList
      },
      
    ]
  },
  
  // 404 route
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/errors/NotFound.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    // Always scroll to top
    return { top: 0 }
  }
});

/*router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  // Check if the user is authenticated
  if (auth.token && !auth.user) {
    try { 
      // Fetch user data if we have a token but no user data
      await auth.fetchUser(); 
    } catch { 
      // If fetching user fails, logout
      auth.logout(); 
    }
  }

  // If route requires authentication and user is not logged in, redirect to login
  if (to.meta.requiresAuth && !auth.isLogged) {
    return next({ name: 'login', query: { redirect: to.fullPath } });
  }

  // If route is for guests only and user is logged in, redirect to dashboard
  if (to.meta.guestOnly && auth.isLogged) {
    return next({ name: 'dashboard' });
  }

  // If route requires admin role and user is not an admin, redirect to dashboard
  if (to.meta.requiresAdmin && !auth.isAdmin) {
    return next({ name: 'dashboard' });
  }

  // Proceed to the route
  next();
});*/

export default router;