// api/callback.js — GitHub OAuth 回調端點
// 接收 GitHub 傳回的 code，換取 access_token，再透過 postMessage 傳回給 CMS

export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    res.status(400).send(`GitHub 授權失敗: ${error}`);
    return;
  }

  if (!code) {
    res.status(400).send('缺少授權碼');
    return;
  }

  try {
    // 向 GitHub 換取 access_token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.OAUTH_CLIENT_ID,
        client_secret: process.env.OAUTH_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error || !tokenData.access_token) {
      res.status(400).send(`Token 交換失敗: ${tokenData.error_description || tokenData.error}`);
      return;
    }

    // 透過 postMessage 將 token 傳回給 CMS 視窗
    res.setHeader('Content-Type', 'text/html');
    res.send(`<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>授權中...</title></head>
<body>
<script>
  (function() {
    const token = ${JSON.stringify(tokenData.access_token)};
    const provider = 'github';
    function sendMessage(message) {
      window.opener.postMessage(
        'authorization:' + provider + ':success:' + JSON.stringify({ token: token, provider: provider }),
        message.origin
      );
      window.close();
    }
    window.addEventListener('message', sendMessage, false);
    window.opener.postMessage('authorizing:' + provider, '*');
  })();
</script>
<p>授權成功，請稍候...</p>
</body>
</html>`);

  } catch (err) {
    res.status(500).send(`伺服器錯誤: ${err.message}`);
  }
}
