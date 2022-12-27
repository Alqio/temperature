import { Message } from 'node-telegram-bot-api';

require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const apiUrl = process.env.API_URL;
const token = process.env.BOT_TOKEN;
const defaultMessage = process.env.DEFAULT_MESSAGE || 'Lämpötila: @';
const alertMessage = process.env.ALERT_MESSAGE || 'Lämpötila on kriittisen alhainen: @ C!';
const chatsIds = process.env.CHATS?.split(',') || [];

const chatMessageMap: Record<string, Message> = {};

let previousTimestamp: Date = new Date();

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg: Message) => {
  const chatId = msg.chat.id;
  console.log(`Message received from ${chatId}. Message: ${msg.text}`);
  if (!(chatId in chatMessageMap)) {
    chatMessageMap[chatId] = await bot.sendMessage(chatId, 'Chat noted.');
  }
});

const updateMessage = (temperature: number, timestamp: Date) => {
  if (previousTimestamp.getTime() === timestamp.getTime()) {
    return;
  }
  console.log(`Updating temperature to ${temperature}.`);
  previousTimestamp = timestamp;

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

const sendAlert = (temperature: number, timestamp: Date) => {
  if (previousTimestamp.getTime() === timestamp.getTime()) {
    return;
  }
  previousTimestamp = timestamp;
  const newText = alertMessage.replace('$', timestamp.toString()).replace('@', `${temperature}`);
  chatsIds.forEach(async (chatId) => {
    chatMessageMap[chatId] = await bot.sendMessage(chatId, newText);
  });
};

setInterval(async () => {
  const response = await fetch(`${apiUrl}/temperature`);
  if (response.ok) {
    const latestMeasurement = await response.json();
    const { temperature, timestamp } = latestMeasurement;
    const tsAsDate = new Date(timestamp);

    if (temperature >= 5) {
      updateMessage(temperature, tsAsDate);
    } else {
      sendAlert(temperature, tsAsDate);
    }
  } else {
    console.log(`Fetching new temperatures failed, http error: ${response.status}, ${response.statusText}`);
  }
}, 3 * 1000);

console.log('Bot started.');
