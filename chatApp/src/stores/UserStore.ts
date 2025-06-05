import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useUserStore = defineStore('user', () => {
  const nickname = ref('');

  const setNickname = (nick: string) => {
    nickname.value = nick; 
  }

  return {
    nickname,
    setNickname
  }
}, {
  persist: {
    storage: localStorage,
  },
});