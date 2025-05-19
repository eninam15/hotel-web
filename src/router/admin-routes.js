// src/router/admin-routes.js
import AdminDashboard from '@/views/admin/AdminDashboard.vue';
//import AdminOverview from '@/views/admin/Dashboard/AdminOverview.vue';
import ReservationsList from '@/views/admin/reservations/ReservationsList.vue';
//import ReservationView from '@/views/admin/reservations/ReservationView.vue';
/*import ReservationEdit from '@/views/admin/reservations/ReservationEdit.vue';
import ReservationCreate from '@/views/admin/reservations/ReservationCreate.vue';*/
import RoomsList from '@/views/admin/rooms/RoomsList.vue';
/*import RoomView from '@/views/admin/rooms/RoomView.vue';
import RoomEdit from '@/views/admin/rooms/RoomEdit.vue';
import RoomCreate from '@/views/admin/rooms/RoomCreate.vue';
import UsersList from '@/views/admin/users/UsersList.vue';
import UserView from '@/views/admin/users/UserView.vue';
import UserEdit from '@/views/admin/users/UserEdit.vue';
import UserCreate from '@/views/admin/users/UserCreate.vue';
import AdminSettings from '@/views/admin/settings/AdminSettings.vue';*/

// Routes configuration for the admin section
const adminRoutes = {
  path: '/admin',
  component: AdminDashboard,
  //meta: { requiresAuth: true, requiresAdmin: true },
  children: [
    /*{
      path: '',
      name: 'admin.dashboard',
      component: AdminOverview
    },*/
    // Reservations routes
    {
      path: 'reservations',
      name: 'admin.reservations',
      component: ReservationsList
    },
    /*{
      path: 'reservations/create',
      name: 'admin.reservations.create',
      component: ReservationCreate
    },*/
    /*{
      path: 'reservations/:id',
      name: 'admin.reservations.view',
      component: ReservationView,
      props: true
    },*/
    /*{
      path: 'reservations/:id/edit',
      name: 'admin.reservations.edit',
      component: ReservationEdit,
      props: true
    },*/
    // Rooms routes
    {
      path: 'rooms',
      name: 'admin.rooms',
      component: RoomsList
    },
    /*{
      path: 'rooms/create',
      name: 'admin.rooms.create',
      component: RoomCreate
    },
    {
      path: 'rooms/:id',
      name: 'admin.rooms.view',
      component: RoomView,
      props: true
    },
    {
      path: 'rooms/:id/edit',
      name: 'admin.rooms.edit',
      component: RoomEdit,
      props: true
    },
    // Users routes
    {
      path: 'users',
      name: 'admin.users',
      component: UsersList
    },
    {
      path: 'users/create',
      name: 'admin.users.create',
      component: UserCreate
    },
    {
      path: 'users/:id',
      name: 'admin.users.view',
      component: UserView,
      props: true
    },
    {
      path: 'users/:id/edit',
      name: 'admin.users.edit',
      component: UserEdit,
      props: true
    },
    // Settings route
    {
      path: 'settings',
      name: 'admin.settings',
      component: AdminSettings
    }*/
  ]
};

export default adminRoutes;