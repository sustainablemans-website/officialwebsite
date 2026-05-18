// api/auth.js — GitHub OAuth 流程啟動端點
// 由 Vercel 自動部署為 Serverless Function

export default function handler(req, res) {
  const { host } = req.headers;
  const callbackUrl = `https://${host}/api/callback`;

  const params = new URLSearchParams({
    client_id: process.env.OAUTH_CLIENT_ID,
    redirect_uri: callbackUrl,
    scope: 'repo,user',
    state: Math.random().toString(36).substring(7),
  });

  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
}
