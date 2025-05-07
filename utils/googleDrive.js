import { google } from 'googleapis';
import fs from 'fs';
import path from 'path';
import stream from 'stream';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Path to your saved token file
const TOKEN_PATH = path.resolve('tokens.json');

// Load saved tokens if they exist

export const loadSavedCredentials = () => {
  if (fs.existsSync(TOKEN_PATH)) {
    const raw = fs.readFileSync(TOKEN_PATH);
    const tokens = JSON.parse(raw);
    oauth2Client.setCredentials(tokens);
    savedCredentials = tokens;
    console.log('✅ Loaded saved Google Drive credentials');
  } else {
    console.warn('⚠️ No saved Google Drive credentials found');
  }
};

export const setGoogleDriveCredentials = (tokens) => {
  oauth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2));
  console.log('✅ Google tokens updated');
};

export const uploadFileToDrive = async (fileName, contentBuffer) => {
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
