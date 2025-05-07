import { google } from 'googleapis';
import stream from 'stream';
import fs from 'fs';
import path from 'path';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

const TOKENS_PATH = path.resolve('tokens.json');

// Load saved tokens from disk (if exist)
export const loadSavedCredentials = () => {
  if (fs.existsSync(TOKENS_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, 'utf8'));
    oauth2Client.setCredentials(tokens);
    console.log('✅ Google Drive credentials loaded from file.');
  } else {
    console.warn('⚠️ No saved credentials found. Please authorize first.');
  }
};

// Save tokens to disk after initial authorization
const saveCredentials = (tokens) => {
  fs.writeFileSync(TOKENS_PATH, JSON.stringify(tokens, null, 2));
  console.log('✅ Google Drive tokens saved to tokens.json');
};

// Step 1: Generate consent URL
export const generateAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/drive.file'],
  });
};

// Step 2: Exchange code for tokens and save
export const getAccessToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  saveCredentials(tokens);
  return tokens;
};

// Optional: set manually (e.g. from DB or other persistent source)
export const setGoogleDriveCredentials = (tokens) => {
  oauth2Client.setCredentials(tokens);
};

// Final: Upload a file to Google Drive
export const uploadFileToDrive = async (fileName, contentBuffer) => {
  const creds = oauth2Client.credentials;

  if (!creds || (!creds.access_token && !creds.refresh_token)) {
    throw new Error('Google Drive token not set. Call setGoogleDriveCredentials or authorize.');
  }

  const drive = google.drive({ version: 'v3', auth: oauth2Client });

  const bufferStream = new stream.PassThrough();
  bufferStream.end(Buffer.from(contentBuffer));

  const res = await drive.files.create({
    requestBody: {
      name: fileName,
      mimeType: 'application/json',
    },
    media: {
      mimeType: 'application/json',
      body: bufferStream,
    },
    fields: 'id, webViewLink',
  });

  return res.data;
};
