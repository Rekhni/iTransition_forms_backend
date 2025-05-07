// utils/googleDrive.js
import { google } from 'googleapis';
import stream from 'stream';

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Store credentials in memory (or move to DB/file later)
let savedCredentials = null;

export const generateAuthUrl = () => {
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/drive.file'],
  });
};

export const getAccessToken = async (code) => {
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);
  savedCredentials = tokens; // optional
  return tokens;
};

export const setGoogleDriveCredentials = (tokens) => {
  oauth2Client.setCredentials(tokens);
  savedCredentials = tokens;
};

export const uploadFileToDrive = async (fileName, contentBuffer) => {
  if (!savedCredentials?.access_token) {
    throw new Error('Google Drive token not set. Call setGoogleDriveCredentials first.');
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
