import TelegramBot from 'node-telegram-bot-api';
import axios from 'axios';
import { parse } from 'node-html-parser';
import { Selectors } from './const/selectors';
import logger from "./helpers/winston";
import fs from 'fs';

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

// const QA_NEWS = async () => {
//     const selectors = Selectors.qaNews;
//     const baseUrl = "https://habr.com/en/search/?q=qa&target_type=posts&order=date";
//     const habrBaseUrl = "https://habr.com";

//     try {
//         const response = await axios.get(baseUrl);
//         const root = parse(response.data);
//         const newsElements = root.querySelectorAll(selectors.article);

//         for (const element of newsElements) {
//             const linkElement = element.querySelector(selectors.linkElement);
//             const textElement = element.querySelector(selectors.textElement);
//             const imgElement = element.querySelector(selectors.imgElement);

//             if (linkElement && textElement) {
//                 const text = textElement.text;
//                 const href = linkElement.getAttribute('href');
//                 const fullURL = `${habrBaseUrl}${href}`;

//                 if (!publishedLastNews.some((published) => published.href === fullURL)) {
//                     bot.sendMessage(chatId, `<a href="${fullURL}">${text}</a>`, { parse_mode: 'HTML' })
//                         .then(() => {
//                             publishedLastNews.push({ text, href: fullURL });
//                             logger.info(`Sent new news: ${text}`);
//                         })
//                         .catch((error: { code: string; response: { description: string; }; }) => {
//                             if (error.code === 'ETELEGRAM' && error.response && error.response.description === 'Not Found') {
//                                 logger.error('Telegram API Error: 404 Not Found');
//                             } else {
//                                 logger.error('[scrapeNews] : Error sending message:', error);
//                             }
//                         });
//                 }
//             }
//         }
//     } catch (error) {
//         logger.error('[scrapeNews] :', error);
//     }
// };



const QA_NEWS = async () => {
    const selectors = Selectors.qaNews;
    const baseUrl = "https://habr.com/en/search/?q=qa&target_type=posts&order=date";
    const habrBaseUrl = "https://habr.com"; // Убедитесь, что нет закрывающего слеша

    try {
        const response = await axios.get(baseUrl);
        const root = parse(response.data);
        const newsElements = root.querySelectorAll(selectors.article);

        for (const element of newsElements) {
            const linkElement = element.querySelector(selectors.linkElement);
            const textElement = element.querySelector(selectors.textElement);
            const imgElement = element.querySelector(selectors.imgElement);

            if (linkElement && textElement) {
                const text = textElement.text;
                const href = linkElement.getAttribute('href');
                const fullURL = `${habrBaseUrl}${href}`;

                if (!publishedLastNews.some((published) => published.href === fullURL)) {
                    const messageOptions = {
                        parse_mode: 'HTML',
                    };

                    if (imgElement) {
                        const imgURL = imgElement.getAttribute('src');

                        // Отправка изображения и текста в чат
                        bot.sendPhoto(chatId, imgURL, {
                            caption: `<a href="${fullURL}">${text}</a>`,
                            parse_mode: 'HTML'
                        })
                        .then(() => {
                            publishedLastNews.push({ text, href: fullURL });
                            logger.info(`Sent new news: ${text}`);
                        })
                        .catch((error) => {
                            if (error.code === 'ETELEGRAM' && error.response && error.response.description === 'Not Found') {
                                logger.error('Telegram API Error: 404 Not Found');
                            } else {
                                logger.error('[scrapeNews] : Error sending message:', error);
                            }
                        });
                    } else {
                        bot.sendMessage(chatId, `<a href="${fullURL}">${text}</a>`, messageOptions)
                            .then(() => {
                                publishedLastNews.push({ text, href: fullURL });
                                logger.info(`Sent new news: ${text}`);
                            })
                            .catch((error) => {
                                if (error.code === 'ETELEGRAM' && error.response && error.response.description === 'Not Found') {
                                    logger.error('Telegram API Error: 404 Not Found');
                                } else {
                                    logger.error('[scrapeNews] : Error sending message:', error);
                                }
                            });
                    }
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
setInterval(QA_NEWS, 3600000);