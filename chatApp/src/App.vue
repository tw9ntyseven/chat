<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
  <AppToast />
</template>

<script setup lang="ts">
import { AppToast } from '@/components';
import { IonApp, IonRouterOutlet } from '@ionic/vue';
</script>
