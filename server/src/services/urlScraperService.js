import axios from 'axios';
import * as cheerio from 'cheerio';

export async function scrapeUrl(url) {
  const response = await axios.get(url, {
    timeout: 12000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
      'Accept': 'text/html,application/xhtml+xml',
    },
  });

  const $ = cheerio.load(response.data);
  $('script, style, nav, footer, header, aside, noscript, [role="navigation"]').remove();
  $('[class*="nav"], [class*="menu"], [class*="sidebar"], [class*="cookie"], [class*="banner"]').remove();

  const candidates = ['article', 'main', '[role="main"]', '.content', '.post', '.entry', 'body'];
  let content = '';

  for (const selector of candidates) {
    const el = $(selector).first();
    if (el.length) {
      content = el.text().replace(/\s+/g, ' ').trim();
      if (content.length > 200) break;
    }
  }

  const title = $('title').text().trim() || $('h1').first().text().trim() || 'Untitled';

  if (content.length < 100) {
    throw new Error('Could not extract enough text from this URL. Try copy-pasting the text instead.');
  }

  return { text: content.slice(0, 12000), title };
}