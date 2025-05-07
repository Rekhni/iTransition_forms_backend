import { uploadFileToDrive } from '../utils/googleDrive.js';

export const uploadSupportTicketToGoogle = async (req, res) => {
  const { summary, priority, pageUrl } = req.body;

  if (!summary || !priority || !pageUrl)
    return res.status(400).json({ msg: 'Missing fields' });

  const ticketData = {
    user: req.user.name,
    summary,
    priority,
    pageUrl,
    submittedAt: new Date().toISOString(),
  };

  const fileName = `support-ticket-${Date.now()}.json`;

  try {
    const file = await uploadFileToDrive(fileName, JSON.stringify(ticketData, null, 2));
    res.json({ msg: 'Uploaded successfully', fileLink: file.webViewLink });
  } catch (err) {
    console.error('Google Drive upload failed:', err.message);
    res.status(500).json({ msg: 'Upload failed' });
  }
};
