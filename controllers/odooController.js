import db from "../models/index.js";
const { User, Template, Question, Form, Answer } = db;

export const getAggregatedTemplates = async (req, res) => {
  const token = req.query.token;

  if (!token) return res.status(400).json({ msg: "Missing token" });

  const user = await User.findOne({ where: { apiToken: token } });
  if (!user) return res.status(403).json({ msg: "Invalid token" });

  const templates = await Template.findAll({
    where: { authorId: user.id },
    include: [
      { model: Question },
      { model: Form, include: [Answer] }
    ]
  });

  const result = templates.map(template => ({
    id: template.id,
    title: template.title,
    author: { id: user.id, name: user.name },
    questions: template.Questions.map(q => {
      const values = template.Forms.flatMap(f =>
        f.Answers.filter(a => a.questionId === q.id).map(a => a.value)
      );

      if (q.type === 'number') {
        const nums = values.map(Number);
        return {
          text: q.text,
          type: q.type,
          count: nums.length,
          average: nums.reduce((a, b) => a + b, 0) / nums.length || 0,
          min: Math.min(...nums),
          max: Math.max(...nums)
        };
      }

      if (q.type === 'text') {
        const freq = {};
        values.forEach(val => { freq[val] = (freq[val] || 0) + 1 });
        const topAnswers = Object.entries(freq)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([text, count]) => ({ text, count }));
        return { text: q.text, type: q.type, count: values.length, topAnswers };
      }

      return { text: q.text, type: q.type, count: values.length };
    })
  }));

  res.json(result);
};
