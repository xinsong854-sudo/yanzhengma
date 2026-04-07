const API_BASE = 'https://api.talesofai.cn';

export async function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);

  // Reconstruct the API path: /api/user/xxx -> /v1/user/xxx
  const apiPath = '/v1' + url.pathname.replace(/^\/api/, '');

  const targetUrl = API_BASE + apiPath;

  const headers = new Headers(request.headers);
  // Override host for the target
  headers.set('User-Agent', 'NietaApp/6.10.1');

  const body = request.method !== 'GET' ? await request.text() : undefined;

  const response = await fetch(targetUrl, {
    method: request.method,
    headers,
    body,
  });

  return new Response(response.body, {
    status: response.status,
    headers: {
      'Content-Type': response.headers.get('Content-Type') || 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, x-token, authorization',
    },
  });
}
