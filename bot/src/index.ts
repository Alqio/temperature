import { Message } from 'node-telegram-bot-api';

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const apiUrl = process.env.API_URL;
const token = process.env.BOT_TOKEN;
const defaultMessage = process.env.DEFAULT_MESSAGE || 'Lämpötila: @';
const chatsIds = process.env.CHATS?.split(',') || [];

const chatMessageMap: Record<string, Message> = {};

const messages: Message[] = [];

let previousTemperature = 0;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg: Message) => {
  const chatId = msg.chat.id;
  console.log(`Message received from ${chatId}. Message: ${msg.text}`);
  if (!(chatId in chatMessageMap)) {
    chatMessageMap[chatId] = await bot.sendMessage(chatId, 'Chat noted.');
  }
});

const updateMessage = (newMeasurement: any) => {
  console.log(newMeasurement);
  const { temperature, timestamp } = newMeasurement;

  if (previousTemperature === temperature) {
    return;
  }
  console.log(`Updating temperature from ${previousTemperature} to ${temperature}.`);
  previousTemperature = temperature;

  const newText = defaultMessage.replace('@', `${temperature}`);

  chatsIds.forEach(async (chatId) => {
    if (chatId in chatMessageMap) {
      chatMessageMap[chatId] = await bot.editMessageText(newText, {
        chat_id: chatMessageMap[chatId].chat.id,
        message_id: chatMessageMap[chatId].message_id
      });
    } else {
      chatMessageMap[chatId] = await bot.sendMessage(chatId, newText);
    }
  });
};

setInterval(async () => {
  const response = await fetch(`${apiUrl}/temperature`);
  if (response.ok) {
    const latestMeasurement = await response.json();
    updateMessage(latestMeasurement);
  } else {
    console.log(`Fetching new temperatures failed, http error: ${response.status}, ${response.statusText}`);
  }
}, 3 * 1000);

console.log('Bot started.');
