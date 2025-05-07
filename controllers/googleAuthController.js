// controllers/googleAuthController.js
import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import { setGoogleDriveCredentials } from '../utils/googleDrive.js';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const TOKEN_PATH = path.resolve('tokens.json');

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

    // Persist the token
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
    setGoogleDriveCredentials(tokens); // update runtime client too

    console.log('✅ Google tokens saved to tokens.json');
    res.send('✅ Authorization successful. You can close this window.');
  } catch (err) {
    console.error('❌ Token exchange error:', err.message);
    res.status(500).send('Failed to authorize');
  }
};
