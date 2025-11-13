const WINDBORNE_BASE_URL = 'https://a.windbornesystems.com/treasure/';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { hour } = req.query;
  const hourParam = Array.isArray(hour) ? hour[0] : hour;

  if (!hourParam || !/^\d{2}$/.test(hourParam)) {
    return res.status(400).json({ error: 'Missing or invalid hour parameter. Expected 2-digit string (00-23).' });
  }

  const targetUrl = `${WINDBORNE_BASE_URL}${hourParam}.json`;

  try {
    const response = await fetch(targetUrl, {
      headers: {
        Accept: 'application/json',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      const text = await response.text();
      return res.status(response.status).json({
        error: 'Upstream request failed',
        status: response.status,
        body: text,
      });
    }

    const data = await response.json();

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=60');
    return res.status(200).json(data);
  } catch (error) {
    console.error('Proxy fetch failed:', error);
    return res.status(500).json({ error: 'Failed to fetch data from WindBorne API', details: error.message });
  }
}

export const config = {
  runtime: 'edge',
};
