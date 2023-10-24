// import TelegramBot from 'node-telegram-bot-api';
// import axios from 'axios';
// import { parse } from 'node-html-parser';
// import { Selectors } from './const/selectors';
// import logger from "./helpers/winston";
// import { Send } from './helpers/message';
// const send = new Send();

// const token = process.env.TOKEN;
// const chatId = process.env.CHAT_ID;

// const bot = new TelegramBot(token, { polling: true });

// export const QA_NEWS = async () => {
//     const hashtags = ["qa", "тестирование"];

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
//                 const caption = `<a href="${fullURL}">${text}</a>`;
//                 const textWithHashtags = send.addHashtags(text, hashtags);

//                 if (imgElement) {
//                     const imgURL = imgElement.getAttribute('src');
//                     const captionWithHashtags = send.addHashtags(caption, hashtags);
//                     await send.sendImageMessage(bot, chatId, imgURL, captionWithHashtags);
//                     logger.info(`[QA] : ${textWithHashtags}`);
//                 } else {
//                     const captionWithHashtags = send.addHashtags(caption, hashtags);
//                     await send.sendTextMessage(bot, chatId, captionWithHashtags);
//                     logger.info(`[QA] : ${textWithHashtags}`);
//                 }
//             }
//         }
//     } catch (error) {
//         logger.error('[QA_NEWS] :', error);
//     }
// };


