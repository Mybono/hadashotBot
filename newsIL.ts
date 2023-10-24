import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import logger from "./helpers/winston";
import { parse } from 'node-html-parser';
import { Selectors } from './const/selectors';
import { Send } from './helpers/message';

const send = new Send();
const selectors = Selectors.newsru;
const baseUrl = process.env.NEWSRU_IL_BASE_URL;
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const NEWSRU_IL = async (bot: TelegramBot, chatId: any) => {
  while (true) {
    try {
      const response = await axios.get(baseUrl);
      const root = parse(response.data);
      const newsElements = root.querySelectorAll(selectors.article);

      const oldNews = await send.loadOldNews();

      const newNews = newsElements.slice(0, 3).filter(element => {
        const href = element.querySelector(selectors.titleAndHref).getAttribute('href');
        return !oldNews.includes(href);
      });


      for (const element of newNews) {
        const timestamp = parseInt(element.getAttribute('data-time'), 10);
        const href = element.querySelector(selectors.titleAndHref).getAttribute('href');
        const anonsElement = element.querySelector(selectors.anons);
        const titleAndHrefElement = element.querySelector(selectors.titleAndHref);
        const imgElement = element.querySelector(selectors.imgElement);

        if (anonsElement && titleAndHrefElement) {
          const anons = anonsElement.text;
          const text = titleAndHrefElement.text;
          const message = `<a href="${href}">${text}</a>\n\n${anons}`;

          if (imgElement) {
            const imgURL = imgElement.getAttribute('src');
            await send.sendImageMessage(bot, chatId, imgURL, message);
            logger.info(`[IL] : ${anons}`);
          }
          await oldNews.push(href);
        }
      }

      if (newNews.length > 0) {
        send.saveOldNews(oldNews);
      }

      await delay(600000);
    } catch (error) {
      logger.error('[IL_NEWS] :', error);
      await delay(2000);
    }
  }
};


