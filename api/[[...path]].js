export const config = { runtime: 'edge' };

const API_BASE = 'https://api.talesofai.cn';

export default async function handler(req) {
  const url = new URL(req.url);
  const apiPath = '/v1' + url.pathname.replace(/^\/api/, '');
  const targetUrl = API_BASE + apiPath;

  const body = req.method !== 'GET' ? await req.text() : undefined;

  const response = await fetch(targetUrl, {
    method: req.method,
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'NietaApp/6.10.1',
    },
    body,
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
