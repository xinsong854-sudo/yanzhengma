export const config = { runtime: 'edge' };

const API_BASE = 'https://api.talesofai.cn';

export default async function handler(req) {
  const url = new URL(req.url);
  
  // Extract the path after /api/
  // e.g., /api/user/request-verification-code -> /v1/user/request-verification-code
  let pathPart = url.pathname;
  if (pathPart.startsWith('/api/')) {
    pathPart = '/v1/' + pathPart.slice(5);
  } else {
    pathPart = '/v1' + pathPart;
  }

  const targetUrl = API_BASE + pathPart;
  console.log(`Proxying: ${req.method} ${pathPart} -> ${targetUrl}`);

  const headers = new Headers();
  headers.set('Content-Type', 'application/json');
  headers.set('User-Agent', 'NietaApp/6.10.1');

  const body = req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined;

  try {
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
    });

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'application/json');
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', 'Content-Type, x-token, authorization');

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'API request failed', detail: error.message }),
      {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
}
