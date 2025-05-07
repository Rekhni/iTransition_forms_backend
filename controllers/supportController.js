import { getMicrosoftAccessToken } from '../utils/microsoftGraph.js';
import axios from 'axios';
import FormData from 'form-data';

export const uploadSupportTicket = async (req, res) => {
  const { summary, priority, templateTitle, pageUrl } = req.body;

  if (!summary || !priority || !pageUrl) {
    return res.status(400).json({ msg: 'Missing fields in support ticket' });
  }

  try {
    const user = req.user;

    const ticketData = {
      reportedBy: { id: user.id, name: user.name, email: user.email },
      template: templateTitle || null,
      link: pageUrl,
      priority,
      summary,
      timestamp: new Date().toISOString()
    };

    const fileContent = Buffer.from(JSON.stringify(ticketData, null, 2));

    const form = new FormData();
    form.append('file', fileContent, {
      filename: `support-ticket-${Date.now()}.json`,
      contentType: 'application/json'
    });

    const accessToken = await getMicrosoftAccessToken();

    // Upload to OneDrive folder
    const folderName = process.env.MS_FOLDER_NAME || 'SupportTickets';

    const response = await axios.put(
      `https://graph.microsoft.com/v1.0/me/drive/root:/${folderName}/${form.getBoundary()}.json:/content`,
      fileContent,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json({ msg: 'Support ticket uploaded', url: response.data.webUrl });
  } catch (err) {
    console.error('Upload failed:', err.response?.data || err.message);
    res.status(500).json({ msg: 'Failed to upload support ticket' });
  }
};
