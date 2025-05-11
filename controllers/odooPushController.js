// File: controllers/odooPushController.js
import axios from 'axios';
import db from '../models/index.js';

const { User, Template, Question, Form, Answer } = db;

const ODOO_URL = process.env.ODOO_URL;
const ODOO_DB = process.env.ODOO_DB;
const ODOO_EMAIL = process.env.ODOO_EMAIL;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD;

const loginToOdoo = async () => {
  const response = await axios.post(`${ODOO_URL}/jsonrpc`, {
    jsonrpc: '2.0',
    method: 'call',
    id: new Date().getTime(),
    params: {
      service: 'common',
      method: 'login',
      args: [ODOO_DB, ODOO_EMAIL, ODOO_PASSWORD],
    },
  });
  return response.data.result;
};

const createInOdoo = async (uid, template) => {
  const questions_json = JSON.stringify(template.questions);

  const response = await axios.post(`${ODOO_URL}/jsonrpc`, {
    jsonrpc: '2.0',
    method: 'call',
    id: new Date().getTime(),
    params: {
      service: 'object',
      method: 'execute_kw',
      args: [
        ODOO_DB,
        uid,
        ODOO_PASSWORD,
        'external.template',
        'create',
        [
          {
            title: template.title,
            author_name: template.author.name,
            questions_json,
          },
        ],
      ],
    },
  });

  return response.data.result;
};

export const pushToOdoo = async (req, res) => {
  const token = req.body.token;
  if (!token) return res.status(400).json({ error: 'Missing token' });

  try {
    const user = await User.findOne({ where: { apiToken: token } });
    if (!user) return res.status(403).json({ error: 'Invalid token' });

    const templates = await Template.findAll({
      where: { authorId: user.id },
      include: [
        { model: Question },
        { model: Form, include: [Answer] },
      ],
    });

    const aggregated = templates.map((template) => ({
      title: template.title,
      author: { name: user.name },
      questions: template.Questions.map((q) => {
        const values = template.Forms.flatMap((f) =>
          f.Answers.filter((a) => a.questionId === q.id).map((a) => a.value)
        );

        if (q.type === 'number') {
          const nums = values.map(Number);
          return {
            text: q.text,
            type: q.type,
            count: nums.length,
            average: nums.reduce((a, b) => a + b, 0) / nums.length || 0,
            min: Math.min(...nums),
            max: Math.max(...nums),
          };
        }

        if (q.type === 'text') {
          const freq = {};
          values.forEach((val) => {
            freq[val] = (freq[val] || 0) + 1;
          });
          const topAnswers = Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([text, count]) => ({ text, count }));
          return { text: q.text, type: q.type, count: values.length, topAnswers };
        }

        return { text: q.text, type: q.type, count: values.length };
      }),
    }));

    const uid = await loginToOdoo();
    const created = [];
    for (const template of aggregated) {
      const id = await createInOdoo(uid, template);
      created.push(id);
    }

    res.json({ success: true, created });
  } catch (err) {
    console.error('Push to Odoo failed:', err);
    res.status(500).json({ error: 'Failed to push to Odoo' });
  }
};
