export class Selectors {
    static newsru = {
        newslistItem : '.newslist a.newslist_title',
        importantItem : '.important a',
        article: `div.topic-list-container`,
        anons: `.news_list_anons`,
        imgElement : `.news-img`,
        titleAndHref: `.news_list_title`

      }
    static qaNews = {
      article : 'article ',
      linkElement : 'h2 [data-test-id="article-snippet-title-link"]',
      textElement : 'h2 span',
      imgElement : '.tm-article-body img',

    }
}

