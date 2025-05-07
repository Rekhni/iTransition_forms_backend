// controllers/googleAuthController.js

import { google } from 'googleapis';

let GOOGLE_DRIVE_ACCESS_TOKEN = null;

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export const getGoogleAuthURL = (req, res) => {
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/drive.file'],
  });

  res.redirect(url);
};

export const googleCallback = async (req, res) => {
  const { code } = req.query;

  if (!code) return res.status(400).send('Missing code');

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    global.GOOGLE_DRIVE_TOKENS = tokens;

    // Store tokens securely for future use (DB, session, etc.)
    console.log('Google tokens:', tokens);

    res.send('Authorization successful. You can close this window.');
  } catch (err) {
    console.error('Error exchanging code for tokens:', err.message);
    res.status(500).send('Failed to authorize');
  }
};
