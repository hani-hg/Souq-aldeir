function present(name) {
  return Boolean(String(process.env[name] || '').trim());
}

export default function handler(_req, res) {
  const hasJson = present('FIREBASE_SERVICE_ACCOUNT_JSON');
  const hasSplitFirebase = present('FIREBASE_PROJECT_ID') && present('FIREBASE_CLIENT_EMAIL') && present('FIREBASE_PRIVATE_KEY');
  const status = {
    ok: (hasJson || hasSplitFirebase) && present('SMTP_APP_PASSWORD'),
    service: 'password-reset',
    config: {
      firebaseAdmin: hasJson || hasSplitFirebase,
      smtpPassword: present('SMTP_APP_PASSWORD'),
      smtpUser: present('SMTP_USER'),
      appUrl: present('APP_URL') || present('VERCEL_URL')
    }
  };
  return res.status(status.ok ? 200 : 503).json(status);
}
