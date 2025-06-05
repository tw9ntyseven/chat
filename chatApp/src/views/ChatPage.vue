<template>
  <ion-page>
    <ion-header class="ion-no-border">
      <ion-toolbar class="chat">
        <ion-buttons slot="start">
          <ion-button @click="goBack">
            <ion-icon :icon="chevronBack" />
          </ion-button>
        </ion-buttons>
        <div class="chat__user">
          <h2 class="chat__username">{{ userName }}</h2>
          <span class="chat__status">online</span>
        </div>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon :icon="searchOutline" />
          </ion-button>
          <ion-button>
            <ion-icon :icon="ellipsisVertical" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="chat__content" :scroll-events="true" ref="contentRef">
      <div class="chat__messages">
        <div class="chat__date">{{ getCurrentDate() }}</div>
        <div v-for="(message, index) in messages" 
             :key="index" 
             class="message"
             :class="{ 'message--own': message.user === userName, 'message--other': message.user !== userName }">
          <div class="message__bubble">
            <div class="message__username" v-if="message.user !== userName">{{ message.user }}</div>
            <div class="message__text" v-html="message.text"></div>
            <div class="message__info">
              <span class="message__time">{{ formatMessageTime(message.timestamp) }}</span>
              <div class="message__status" v-if="message.user === userName">
                <ion-icon :icon="checkmarkDone" class="message__status-icon"></ion-icon>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ion-content>

    <ion-footer class="ion-no-border chat__footer">
        <div class="chat-input">
          <ion-button fill="clear" class="chat-input__attachment">
            <ion-icon :icon="attachOutline" />
          </ion-button>
          <ion-input
            class="chat-input__field"
            placeholder="Сообщение"
            v-model="messageText"
            @keyup.enter="sendMessage"
          ></ion-input>
          <ion-button v-if="!messageText" fill="clear" class="chat-input__voice">
            <ion-icon :icon="micOutline" />
          </ion-button>
          <ion-button v-else class="chat-input__send" @click="sendMessage" fill="clear">
            <ion-icon :icon="paperPlaneOutline" />
          </ion-button>
        </div>
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { HubConnectionBuilder, HubConnection } from '@microsoft/signalr';
import { useUserStore, useToastStore } from '@/stores';
import { 
  paperPlaneOutline, 
  micOutline, 
  attachOutline,
  chevronBack,
  searchOutline,
  ellipsisVertical,
  checkmarkDone
} from 'ionicons/icons';
import { formatMessageTime, getCurrentDate } from '@/composables';
import { IMessage } from '@/types';
import { sanitizeText, isSpam } from '@/utils/sanitize';

const router = useRouter();
const userStore = useUserStore();
const toastStore = useToastStore();

const connection = ref<HubConnection | null>(null);
const messages = ref<IMessage[]>([]);
const messageText = ref('');
const contentRef = ref<HTMLElement | null>(null);

const userName = computed(() => userStore.nickname);

/**
 * Прокручивает чат к последнему сообщению
 * @async
 * @returns {Promise<void>}
 */
const scrollToBottom = async () => {
  await nextTick();
  const content = document.querySelector('ion-content');
  if (content) {
    const scrollElement = await (content as any).getScrollElement();
    scrollElement.scrollTo({
      top: scrollElement.scrollHeight,
      behavior: 'smooth'
    });
  }
};

/**
 * Обработчик нажатия кнопки "Назад"
 * Перенаправляет пользователя на главную страницу
 */
const goBack = () => {
  router.push('/');
};

/**
 * Отправляет сообщение в чат
 * @async
 * @returns {Promise<void>}
 * @throws {Error} Если возникла ошибка при отправке сообщения
 */
const sendMessage = async () => {
  const sanitizedText = sanitizeText(messageText.value.trim());
  
  if (!sanitizedText) {
    toastStore.showToast('Сообщение не может быть пустым', 'error');
    return;
  }

  if (isSpam(sanitizedText)) {
    toastStore.showToast('Сообщение содержит нежелательный контент', 'error');
    return;
  }

  if (connection.value && connection.value.state === 'Connected') {
    try {
      await connection.value.invoke('SendMessage', userName.value, sanitizedText);
      messageText.value = '';
      scrollToBottom();
    } catch (err) {
      toastStore.showToast('Ошибка отправки сообщения', 'error');
    }
  }
};

/**
 * Хук жизненного цикла, выполняющийся при монтировании компонента
 * Инициализирует подключение к SignalR хабу и настраивает обработчики событий
 * @async
 */
onMounted(async () => {
  connection.value = new HubConnectionBuilder()
    .withUrl(`${import.meta.env.VITE_APP_API}/messenger/hub`)
    .withAutomaticReconnect()
    .build();

  /**
   * Обработчик получения нового сообщения
   * @param {string} user - Имя отправителя
   * @param {string} message - Текст сообщения
   */
  connection.value.on('ReceiveMessage', (user: string, message: string) => {
    const sanitizedMessage = sanitizeText(message);
    if (!isSpam(sanitizedMessage)) {
      messages.value.push({
        user: sanitizeText(user),
        text: sanitizedMessage,
        timestamp: new Date()
      });
      scrollToBottom();
    }
  });

  try {
    await connection.value.start();
    toastStore.showToast('Подключено', 'success');
    await scrollToBottom();
  } catch (err) {
    toastStore.showToast(`Ошибка подключения: ${err}`, 'error');
    console.error('Error connecting', err);
  }

  window.addEventListener('resize', scrollToBottom);
});

/**
 * Хук жизненного цикла, выполняющийся при размонтировании компонента
 * Закрывает подключение к SignalR хабу и удаляет обработчики событий
 * @async
 */
onUnmounted(async () => {
  if (connection.value) {
    await connection.value.stop();
    toastStore.showToast('Соединение разорвано', 'error');
    console.error('Disconnected');
  }

  window.removeEventListener('resize', scrollToBottom);
});
</script>

<style scoped>
.chat {
  --background: var(--dark-header);
  --border-style: none;
  padding: 0 8px;
  border-bottom: 1px solid var(--dark-divider);
}

.chat ion-button {
  --color: var(--dark-link);
}

.chat__user {
  display: flex;
  flex-direction: column;
  padding-left: 8px;
  max-width: 200px;
  overflow: hidden;
}

.chat__username {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: var(--dark-text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
}

.chat__status {
  font-size: 13px;
  color: var(--dark-accent);
}

.chat__content {
  --background: var(--dark-bg);
}

.chat__messages {
  padding: 8px 16px;
}

.chat__date {
  text-align: center;
  color: var(--dark-text-secondary);
  font-size: 13px;
  margin: 12px 0;
  background: var(--dark-divider);
  padding: 4px 12px;
  border-radius: 12px;
  display: inline-block;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  text-transform: capitalize;
}

.message {
  display: flex;
  margin: 4px 0;
  padding: 0;
  animation: messageAppear 0.3s ease;
}

.message--own {
  justify-content: flex-end;
}

.message--other {
  justify-content: flex-start;
}

.message__bubble {
  max-width: 75%;
  padding: 8px 12px;
  border-radius: 12px;
  position: relative;
  margin: 1px 0;
  box-shadow: 0 2px 4px var(--theme-message-box-shadow-color);
}

.message--own .message__bubble {
  background-color: var(--dark-own-msg);
  border: 1px solid var(--theme-message-border-color);
  border-bottom-right-radius: 6px;
}

.message--other .message__bubble {
  background-color: var(--dark-secondary);
  border: 1px solid var(--theme-message-other-user-color);
  border-bottom-left-radius: 6px;
}

.message__username {
  font-size: 13px;
  font-weight: 500;
  color: var(--dark-link);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}

.message__text {
  font-size: 15px;
  line-height: 1.4;
  color: var(--dark-text);
  margin-right: 55px;
  margin-bottom: 15px;
}

.message__info {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
  position: absolute;
  bottom: 6px;
  right: 12px;
  min-width: 50px;
}

.message__time {
  font-size: 12px;
  color: var(--dark-text-secondary);
}

.message__status {
  display: flex;
  align-items: center;
}

.message__status-icon {
  font-size: 16px;
  color: var(--dark-link);
}

.chat__footer {
  --background: var(--dark-header);
  border-top: 1px solid var(--dark-divider);
}

.chat-input {
  display: flex;
  align-items: center;
  padding: 8px;
  background: var(--dark-header);
  gap: 8px;
}

.chat-input__field {
  --background: var(--dark-input-bg);
  --color: var(--dark-text);
  --placeholder-color: var(--dark-text-secondary);
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 8px;
  --padding-bottom: 8px;
  --border-radius: 18px;
  border: none;
  height: 40px;
  font-size: 15px;
}

.chat-input__field:focus {
  border-color: var(--dark-link);
}

.chat-input__voice,
.chat-input__send {
  --padding-start: 8px;
  --padding-end: 8px;
  height: 40px;
  width: 40px;
  min-width: 40px;
  margin: 0;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-input__voice ion-icon,
.chat-input__send ion-icon {
  font-size: 24px;
  width: 24px;
  height: 24px;
}

.chat-input__voice ion-icon {
  color: var(--dark-text-secondary);
}

.chat-input__send ion-icon {
  color: var(--dark-link);
}

.chat-input__attachment ion-icon {
  font-size: 24px;
  color: var(--dark-text-secondary);
}

.chat-input__attachment:hover,
.chat-input__voice:hover,
.chat-input__send:hover {
  opacity: 0.8;
}

.chat-input__send {
  transform: scale(1);
  transition: transform 0.2s ease;
}

.chat-input__send:active {
  transform: scale(0.95);
}

::-webkit-scrollbar {
  width: 5px;
}

::-webkit-scrollbar-track {
  background: var(--dark-bg);
}

::-webkit-scrollbar-thumb {
  background: var(--dark-divider);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--dark-text-secondary);
}

.message__bubble:hover {
  background-color: var(--dark-hover);
}

.message--own .message__bubble::before {
  content: '';
  position: absolute;
  bottom: 0;
  right: -1px;
  width: 8px;
  height: 8px;
  background: linear-gradient(45deg, transparent 50%, var(--dark-own-msg) 50%);
}

.message--other .message__bubble::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: -1px;
  width: 8px;
  height: 8px;
  background: linear-gradient(-45deg, transparent 50%, var(--dark-secondary) 50%);
}

@keyframes messageAppear {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>