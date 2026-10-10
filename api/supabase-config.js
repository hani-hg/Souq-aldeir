function isServiceRoleKey(key) {
  if (key.startsWith('sb_secret_')) return true;
  const parts = key.split('.');
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString('utf8'));
    return payload.role === 'service_role';
  } catch (_) {
    return false;
  }
}

export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const url = String(process.env.SUPABASE_URL || '').trim();
  const anonKey = String(process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || '').trim();
  if (!url || !anonKey) return res.status(503).json({ error: 'Supabase public configuration is missing' });
  let parsedUrl;
  try { parsedUrl = new URL(url); } catch (_) { return res.status(503).json({ error: 'Supabase URL is invalid' }); }
  if (parsedUrl.protocol !== 'https:' || isServiceRoleKey(anonKey)) {
    return res.status(503).json({ error: 'Supabase public configuration is invalid' });
  }

  // Supabase anon/publishable keys are designed for client use. Never return a service-role key.
  return res.status(200).json({ url: parsedUrl.origin, anonKey });
}
