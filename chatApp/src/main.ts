import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { createPinia } from 'pinia'
import pluginPersistence from 'pinia-plugin-persistence'
import { 
  IonicVue, 
  IonInput, 
  IonLabel, 
  IonItem, 
  IonList, 
  IonButton, 
  IonCardContent, 
  IonCardHeader, 
  IonCardTitle, 
  IonCard, 
  IonContent, 
  IonPage,
  IonToolbar,
  IonTitle,
  IonText,
  IonFooter,
  IonIcon,
} from '@ionic/vue';

import './assets/styles/main.css';
import '@ionic/vue/css/core.css';

import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

import '@ionic/vue/css/palettes/dark.system.css';

const pinia = createPinia()

pinia.use(pluginPersistence)

const app = createApp(App)
  .use(IonicVue)
  .use(router)
  .use(pinia);

app
  .component('ion-input', IonInput)
  .component('ion-label', IonLabel)
  .component('ion-item', IonItem)
  .component('ion-list', IonList)
  .component('ion-button', IonButton)
  .component('ion-card-content', IonCardContent)
  .component('ion-card-header', IonCardHeader)
  .component('ion-card-title', IonCardTitle)
  .component('ion-card', IonCard)
  .component('ion-page', IonPage)
  .component('ion-content', IonContent)
  .component('ion-toolbar', IonToolbar)
  .component('ion-title', IonTitle)
  .component('ion-text', IonText)
  .component('ion-footer', IonFooter)
  .component('ion-icon', IonIcon)

router.isReady().then(() => {
  app.mount('#app');
});
