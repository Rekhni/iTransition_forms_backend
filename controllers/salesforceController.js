// controllers/salesforceController.js
import axios from 'axios';

export const createSalesforceAccountAndContact = async (req, res) => {
  const { access_token, instance_url } = req.body.tokens;
  const { name, email, phone, company } = req.body;

  if (!access_token || !instance_url || !name || !email || !company) {
    return res.status(400).json({ msg: 'Missing required fields' });
  }

  try {
    // 1. Create Account
    const accountRes = await axios.post(
      `${instance_url}/services/data/v58.0/sobjects/Account`,
      { Name: company },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const accountId = accountRes.data.id;

    // 2. Create Contact linked to Account
    const contactRes = await axios.post(
      `${instance_url}/services/data/v58.0/sobjects/Contact`,
      {
        LastName: name,
        Email: email,
        Phone: phone,
        AccountId: accountId
      },
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.status(200).json({
      msg: 'Salesforce Account and Contact created',
      accountId,
      contactId: contactRes.data.id
    });
  } catch (err) {
    console.error('Salesforce error:', err.response?.data || err.message);
    res.status(500).json({ msg: 'Failed to create Salesforce records' });
  }
};
