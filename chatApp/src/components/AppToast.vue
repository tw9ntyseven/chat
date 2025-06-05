<template>
  <ion-toast
    :is-open="isOpen"
    :message="message"
    :duration="duration"
    position="top"
  ></ion-toast>
</template>

<script setup lang="ts">
import { IonToast } from '@ionic/vue';
import { useToastStore } from '@/stores';
import { computed } from 'vue';

const toastStore = useToastStore();

const isOpen = computed(() => toastStore.toast.show);
const message = computed(() => toastStore.toast.message);
const duration = computed(() => toastStore.duration);
</script>