import TelegramBot, { ParseMode } from 'node-telegram-bot-api';
import logger from "./winston";
import fs from 'fs';
const oldNewsFilePath = 'old_news.json';

export class Send {
    constructor() { }

    async sendTextMessage(bot: TelegramBot, chatId: any, text: string) {
        const defaultImgURL = require('./hadashotBot/assets/defaultIMG.jpg');

        const messageOptions = {
            parse_mode: 'HTML' as ParseMode,
        };

        return bot.sendPhoto(chatId, defaultImgURL, {
            caption: text,
            parse_mode: 'HTML',
        });
    };

    async sendImageMessage(bot: TelegramBot, chatId: string, imgURL: string, caption: string, hatags?: any) {
        try {
            const messageOptions = {
                parse_mode: 'HTML' as ParseMode,
            };

            return bot.sendPhoto(chatId, imgURL, {
                caption,
                parse_mode: 'HTML',
            });
        } catch (e) {
            await this.sendTextMessage(bot, chatId, caption);
        }
    };

    async addHashtags(text: any, hashtags: any[]) {
        if (!hashtags || hashtags.length === 0) {
            return text;
        }
        const hashtagString = hashtags.map((tag) => `#${tag}`).join(' ');
        return `${text} ${hashtagString}`;
    };

    async loadOldNews() {
        try {
          if (fs.existsSync(oldNewsFilePath)) {
            const fileContent = fs.readFileSync(oldNewsFilePath, 'utf8');
            return JSON.parse(fileContent);
          }
        } catch (error) {
          logger.error('Error loading old news:', error);
        }
        return [];
      }
      
    async saveOldNews(oldNews: any) {
    try {
        fs.writeFileSync(oldNewsFilePath, JSON.stringify(oldNews), 'utf8');
    } catch (error) {
        logger.error('Error saving old news:', error);
    }
    }
}
