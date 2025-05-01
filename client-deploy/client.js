const express = require('express'); 
const app = express();
const port = 3001;
const axios = require('axios');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
const REDIRECT_URI = 'http://localhost:3001/callback';
let clientCredentials = {}; 

app.get('/', (req, res) =>{ 
  res.send(`
    <h1>OAuth Client Demo</h1>
    <a href="/login">Login with Auth Server</a>
  `);
});

app.get('/login', (req, res) => { 
  res.send(`
    <h1>Enter Client Credentials</h1>
    <form action="/init-auth" method="post">
      <div>
        <label>Client ID:</label>
        <input type="text" name="clientId" required>
      </div>
      <div>
        <label>Client Secret:</label>
        <input type="text" name="clientSecret" required>
      </div>
      <button type="submit">Authorize</button>
    </form>
  `);
});

app.post('/init-auth', (req, res) => {
  clientCredentials = {
    clientId: req.body.clientId,
    clientSecret: req.body.clientSecret
  };

  const authUrl = `https://auth-server-deploy.onrender.com/auth/authorize?response_type=code&client_id=${encodeURIComponent(req.body.clientId)}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
  res.redirect(authUrl);
});  
 
app.get('/callback', async (req, res) => {
  const { code } = req.query; 
  if (!code) {
    return res.status(400).send('Missing authorization code');
  }

  if (!clientCredentials.clientId||!clientCredentials.clientSecret) {
    return res.send(`
      <h1>Credentials Needed</h1>
      <form method="post" action="/callback">
        <div>
          <label>Client ID:</label>
          <input type="text" name="clientId" required>
        </div>
        <div>
          <label>Client Secret:</label>
          <input type="text" name="clientSecret" required>
        </div>
        <input type="hidden" name="code" value="${code}">
        <button type="submit">Get Token</button>
      </form>
    `);
    }

  try {
    const response = await axios.post('https://auth-server-deploy.onrender.com/auth/token', {
      code,
      client_id: clientCredentials.clientId,
      client_secret: clientCredentials.clientSecret,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code'
    }); 

    res.send(`
      <h1>Success!</h1>
      <p>Access Token: <code>${response.data.accessToken}</code></p>
      <a href="/">Start Over</a>
    `); 
  } catch (error) {
    console.error('Token error:', error.response?.data||error.message);
    res.status(500).send(`
      <h1>Error</h1>
      <p>${error.response?.data?.error||'Failed to exchange code for token'}</p>
      <a href="/">Try Again</a>
    `);
  }
});

app.post('/callback', async(req, res) => {
  clientCredentials = {
    clientId: req.body.clientId, 
    clientSecret: req.body.clientSecret
  }; 
    res.redirect(`/callback?code=${req.body.code}`);
});

app.listen(port, () => { 
  console.log(`Client app running on http://localhost:${port}`); 
});

