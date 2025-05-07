import axios from 'axios';

export async function getMicrosoftAccessToken() {
  const params = new URLSearchParams();
  params.append('client_id', process.env.MS_CLIENT_ID);
  params.append('client_secret', process.env.MS_CLIENT_SECRET);
  params.append('grant_type', 'client_credentials');
  params.append('scope', 'https://graph.microsoft.com/.default');

  const response = await axios.post(`https://login.microsoftonline.com/${process.env.MS_TENANT_ID}/oauth2/v2.0/token`, params);
  return response.data.access_token;
}
