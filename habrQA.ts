import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import { parse } from 'node-html-parser';
import { Selectors } from './const/selectors';
import logger from "./helpers/winston";

const token = process.env.TOKEN;
const chatId = process.env.CHAT_ID;

const bot = new TelegramBot(token, { polling: true });
let publishedLastNews: { text: string; href: string }[] = [];

const NEWSRU_IL = async () => {
    const baseUrl = process.env.NEWSRU_IL_BASE_URL;

    try {
        const response = await axios.get(baseUrl);
        const root = parse(response.data);

        const newsElements = root.querySelectorAll(Selectors.newsru.importantItem);

        for (const element of newsElements) {
            const text = element.text;
            const href = element.getAttribute('href');
            
            if (!publishedLastNews.some((published) => published.href === href)) {
                bot.sendMessage(chatId, `<a href="${href}">${text}</a>`, { parse_mode: 'HTML' })
                .then(() => {
                        publishedLastNews.push({ text, href });
                        logger.info(`Sent new news: ${text}`);
                    })
                    .catch((error: { code: string; response: { description: string; }; }) => {
                        if (error.code === 'ETELEGRAM' && error.response && error.response.description === 'Not Found') {
                            logger.error('Telegram API Error: 404 Not Found');
                        } else {
                            logger.error('[scrapeNews] : Error sending message:', error);
                        }
                    });
            }
        }
    } catch (error) {
        logger.error('[scrapeNews] :', error);
    }
};

const QA_NEWS = async () => {
    const baseUrl = "https://habr.com/en/search/?q=qa&target_type=posts&order=date";

    try {
        const response = await axios.get(baseUrl);
        const root = parse(response.data);

        const newsElements = root.querySelectorAll('.tm-sub-page__main article');

        for (const element of newsElements) {
            const linkElement = element.querySelector('h2 a');
            const textElement = element.querySelector('h2 span');

            if (linkElement && textElement) {
                const text = textElement.text;
                const href = linkElement.getAttribute('href');

                if (!publishedLastNews.some((published) => published.href === href)) {
                    bot.sendMessage(chatId, `<a href="${href}">${text}</a>`, { parse_mode: 'HTML' })
                        .then(() => {
                            publishedLastNews.push({ text, href });
                            logger.info(`Sent new news: ${text}`);
                        })
                        .catch((error: { code: string; response: { description: string; }; }) => {
                            if (error.code === 'ETELEGRAM' && error.response && error.response.description === 'Not Found') {
                                logger.error('Telegram API Error: 404 Not Found');
                            } else {
                                logger.error('[scrapeNews] : Error sending message:', error);
                            }
                        });
                }
            }
        }
    } catch (error) {
        logger.error('[scrapeNews] :', error);
    }
};


// NEWSRU_IL();
QA_NEWS();
setInterval(NEWSRU_IL, 3600000);


