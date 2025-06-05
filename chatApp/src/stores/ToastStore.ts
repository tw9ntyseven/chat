import { defineStore } from 'pinia'
import { ref } from 'vue';

export const useToastStore = defineStore('ToastStore', () => {
  const duration = ref(5000);

  const toast = ref({
    show: false,
    message: '',
    type: '',
  })

  const showToast = (message: string, type: 'success' | 'error') => {
    toast.value.show = true
    toast.value.message = message
    toast.value.type = type

    setTimeout(() => {
      toast.value.show = false
    }, duration.value)
  }

  return {
    toast,
    duration,
    showToast
  }
});