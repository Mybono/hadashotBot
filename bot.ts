import TelegramBot from 'node-telegram-bot-api';
import { NEWSRU_IL } from './newsIL';

const token = process.env.TOKEN;
const chatId = process.env.CHAT_ID;


const bot = new TelegramBot(token, { polling: true });

NEWSRU_IL(bot, chatId); 