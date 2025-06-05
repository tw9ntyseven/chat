<template>
  <ion-page>
    <ion-content>
      <div class="auth">
        <div class="auth__logo">
          <ion-icon :icon="chatbubbleOutline"></ion-icon>
        </div>
        <div class="auth__content">
          <h1 class="auth__title">Chat</h1>
          <p class="auth__subtitle">Пожалуйста, введите ваше имя для начала общения</p>
          
          <form @submit.prevent="onSubmit" class="auth-form">
            <div class="auth-form__input-wrapper">
              <ion-input
                v-model="nickname"
                required
                clear-input
                type="text"
                placeholder="Ваше имя"
                class="auth-form__input"
              />
              <div class="auth-form__input-line"></div>
            </div>
            
            <ion-button expand="block" 
                      type="submit" 
                      class="auth-form__button"
                      :disabled="!nickname.trim()">
              Продолжить
              <ion-icon slot="end" :icon="arrowForward"></ion-icon>
            </ion-button>
          </form>
          
          <p class="auth__terms">
            Регистрируясь, вы соглашаетесь с нашими<br>
            <a href="#" class="auth__terms-link">Условиями использования</a>
          </p>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores';
import { arrowForward, chatbubbleOutline } from 'ionicons/icons';

const router = useRouter();
const userStore = useUserStore();

const nickname = ref('');

const onSubmit = () => {
  if (nickname.value.trim()) {
    userStore.setNickname(nickname.value.trim());
    router.push('/chat');
  }
}
</script>

<style scoped>
.auth {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100%;
  padding: 20px;
  text-align: center;
}

.auth__logo {
  width: 120px;
  height: 120px;
  background: linear-gradient(135deg, var(--theme-link-color) 0%, var(--theme-link-hover-color) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  animation: logoAppear 0.5s ease;
}

.auth__logo ion-icon {
  font-size: 60px;
  color: white;
  transform: rotate(-45deg);
}

.auth__content {
  width: 100%;
  max-width: 400px;
  animation: formAppear 0.5s ease;
  animation-delay: 0.2s;
  opacity: 0;
  animation-fill-mode: forwards;
}

.auth__title {
  font-size: 32px;
  font-weight: 500;
  margin: 0 0 8px;
}

.auth__subtitle {
  font-size: 15px;
  color: var(--theme-hint-color);
  margin: 0 0 32px;
  line-height: 1.5;
}

.auth-form {
  margin-bottom: 24px;
}

.auth-form__input-wrapper {
  position: relative;
  margin-bottom: 24px;
}

.auth-form__input {
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 8px;
  --padding-bottom: 8px;
  --placeholder-color: var(--theme-hint-color);
  font-size: 17px;
  border: none;
  background: transparent;
}

.auth-form__input-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--theme-grey-color);
  transition: all 0.3s ease;
}

.auth-form__input:focus-within + .auth-form__input-line {
  height: 2px;
  background: var(--theme-button-color);
}

.auth-form__button {
  --background: var(--theme-button-color);
  --background-activated: var(--theme-button-color);
  --background-hover: var(--theme-button-hover-color);
  --color: var(--theme-button-text-color);
  --border-radius: 8px;
  --box-shadow: none;
  margin-top: 16px;
  height: 48px;
  font-size: 15px;
  font-weight: 500;
  text-transform: none;
  transition: all 0.3s ease;
}

.auth-form__button:disabled {
  --background: var(--theme-disabled-bg);
  --color: var(--theme-disabled-text);
}

.auth__terms {
  font-size: 13px;
  color: var(--theme-hint-color);
  line-height: 1.5;
  margin: 24px 0 0;
}

.auth__terms-link {
  color: var(--theme-link-color);
  text-decoration: none;
}

@keyframes logoAppear {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes formAppear {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@media (max-width: 480px) {
  .auth__logo {
    width: 100px;
    height: 100px;
  }

  .auth__logo ion-icon {
    font-size: 50px;
  }

  .auth__title {
    font-size: 28px;
  }

  .auth__subtitle {
    font-size: 14px;
  }
}

.auth-form__input:hover + .auth-form__input-line {
  background: var(--theme-auth-input-line-color);
}

.auth-form__button:hover:not(:disabled) {
  transform: translateY(-1px);
}

.auth-form__button:active:not(:disabled) {
  transform: translateY(1px);
}

.auth__terms-link:hover {
  text-decoration: underline;
}
</style>