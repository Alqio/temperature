import { Message } from 'node-telegram-bot-api';
import dateFormat, { masks } from "dateformat";


require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const apiUrl = process.env.API_URL;
const token = process.env.BOT_TOKEN;
const defaultMessage = process.env.DEFAULT_MESSAGE || 'Lämpötila: @';
const alertMessage = process.env.ALERT_MESSAGE || 'Lämpötila on kriittisen alhainen: @ C!';
const chatsIds = process.env.CHATS?.split(',') || [];

let hasAlerted = false;

const chatMessageMap: Record<string, Message> = {};

let previousTimestamp: Date = new Date();

const bot = new TelegramBot(token, { polling: true });

bot.on('message', async (msg: Message) => {
  const chatId = msg.chat.id;
  console.log(`Message received from ${chatId}. Message: ${msg.text}`);
  if (!(chatId in chatMessageMap)) {
    chatMessageMap[chatId] = await bot.sendMessage(chatId, 'Chat registered.');
  }
});

const formatDate = (date: Date) => {
  return dateFormat(date, "dd/mm/yyyy HH:MM")
};

const updateMessage = (temperature: number, timestamp: Date) => {
  if (previousTimestamp.getTime() === timestamp.getTime()) {
    return;
  }
  console.log(`Updating temperature to ${temperature}.`);
  previousTimestamp = timestamp;

  const shouldAlert = temperature <= 5;
  const baseText = shouldAlert ? alertMessage : defaultMessage;

  const newText = baseText.replace('$', formatDate(timestamp)).replace('@', `${temperature}`);

  chatsIds.forEach(async (chatId) => {
    if (chatId in chatMessageMap && !hasAlerted && !shouldAlert) {
      try {
        chatMessageMap[chatId] = await bot.editMessageText(newText, {
          chat_id: chatMessageMap[chatId].chat.id,
          message_id: chatMessageMap[chatId].message_id
        });
      } catch (e: any) {
        console.log(`Failed to update message, error: ${e.toString()}`);
        chatMessageMap[chatId] = await bot.sendMessage(chatId, newText);
      }
    } else if (chatId in chatMessageMap && hasAlerted && !shouldAlert) {
      chatMessageMap[chatId] = await bot.sendMessage(chatId, newText);
      hasAlerted = false;
    } else if (!(chatId in chatMessageMap) || (!hasAlerted && shouldAlert)) {
      chatMessageMap[chatId] = await bot.sendMessage(chatId, newText);

      if (shouldAlert) {
        hasAlerted = true;
      }
    }
  });
};

const getLatestTemperature = async () => {
  const response = await fetch(`${apiUrl}/temperature`);
  if (response.ok) {
    const latestMeasurement = await response.json();
    const { temperature, timestamp } = latestMeasurement;
    const tsAsDate = new Date(timestamp);

    updateMessage(temperature, tsAsDate);
  } else {
    console.log(`Fetching new temperatures failed, http error: ${response.status}, ${response.statusText}`);
  }
};

const getMinAndMax = async () => {
  const now = new Date();
  const past = new Date();
  past.setDate(past.getDate() - 3);
  const response = await fetch(`${apiUrl}/temperatures?$start=${past.toString()}&end=${now.toString()}`);

  if (response.ok) {
    const latestMeasurement = await response.json();
    const { temperature, timestamp } = latestMeasurement;
    const tsAsDate = new Date(timestamp);

    updateMessage(temperature, tsAsDate);
  } else {
    console.log(`Fetching new temperatures failed, http error: ${response.status}, ${response.statusText}`);
  }
};

setInterval(async () => {
  await getLatestTemperature();
  //await getMinAndMax();
}, 5 * 1000);

console.log('Bot started.');
