import { createRouter, createWebHistory } from '@ionic/vue-router';
import { AuthPage, ChatPage } from '@/views';
import { useUserStore } from '@/stores';

const routes = [
  { path: '/', component: AuthPage },
  {
    path: '/chat',
    component: ChatPage,
    beforeEnter: () => {
      const userStore = useUserStore();
      if (!userStore.nickname) return '/';
    }
  }
];

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});