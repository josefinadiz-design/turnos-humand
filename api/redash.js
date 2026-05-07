export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { endpoint } = req.query;
  const API_KEY = 'dGSZJG2NokmG8I6YUNh9CNPt0WBNSU8z0Z27Qilt';

  const url = `https://redash.humand.co/api/${endpoint}`;
  const params = new URLSearchParams(req.query);
  params.delete('endpoint');
  const fullUrl = params.toString() ? `${url}?${params}` : url;

  const response = await fetch(fullUrl, {
    method: req.method,
    headers: {
      'Authorization': `Key ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    ...(req.method === 'POST' ? { body: JSON.stringify(req.body) } : {}),
  });

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    const data = await response.json();
    return res.status(response.status).json(data);
  } else {
    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', response.headers.get('content-disposition') || 'attachment');
    return res.status(response.status).send(Buffer.from(buffer));
  }
}
