// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../pages/HomeView.vue'
import ClientView from '../pages/ClientView.vue'
import ContactsView from '../pages/ContactsView.vue'
import LoginView from '../pages/LoginView.vue'
import SignUpView from '../pages/SignUpView.vue'
import { useAuth } from '@/stores/auth.js'

const routes = [
  { 
    path: '/', 
    component: HomeView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/clients', 
    component: ClientView ,
    meta: { requiresAuth: true },
  },
  { 
    path: '/contacts', 
    component: ContactsView,
    meta: { requiresAuth: true } 
  },
  { 
    path: '/login', 
    component: LoginView,
    meta: { guest: true }
  },
  { 
    path: '/signup', 
    component: SignUpView,
    meta: { guest: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth();
  const token = localStorage.getItem('authToken');

  // Se o token estiver presente, considera o usuário autenticado
  if (token) {
    isAuthenticated.value = true;
  } else {
    isAuthenticated.value = false;
  }

  // Bloqueia acesso a rotas que requerem autenticação se o usuário não estiver autenticado
  if (to.meta.requiresAuth && !isAuthenticated.value) {
    next('/login'); // Redireciona para login
  } 
  // Impede acesso à rota de login se o usuário estiver autenticado
  else if (to.meta.guest && isAuthenticated.value) {
    next('/'); // Redireciona para a home
  } else {
    next(); // Prossegue normalmente
  }
});

export default router;
