import { config } from 'dotenv';
import axios from 'axios';
config();

const SF_AUTH_URL = 'https://login.salesforce.com/services/oauth2';

export const getSalesforceAuthURL = (req, res) => {
  const url = `${SF_AUTH_URL}/authorize?response_type=code&client_id=${process.env.SF_CLIENT_ID}&redirect_uri=${process.env.SF_REDIRECT_URI}`;
  res.redirect(url);
};

export const salesforceCallback = async (req, res) => {
  const { code } = req.query;

  try {
    const { data } = await axios.post(`${SF_AUTH_URL}/token`, null, {
      params: {
        grant_type: 'authorization_code',
        client_id: process.env.SF_CLIENT_ID,
        client_secret: process.env.SF_CLIENT_SECRET,
        redirect_uri: process.env.SF_REDIRECT_URI,
        code
      }
    });

    console.log('Salesforce tokens:', data);
    res.redirect(`https://customizable-forms-app.onrender.com/sf-callback?access_token=${data.access_token}&instance_url=${data.instance_url}`);
  } catch (err) {
    console.error('Salesforce auth error:', err.response?.data || err.message);
    res.status(500).send('Salesforce authorization failed');
  }
};
