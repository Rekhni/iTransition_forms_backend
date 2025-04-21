import db from "../models/index.js";
import { Op } from 'sequelize';

const Form = db.Form;
const Answer = db.Answer;
const Template = db.Template;
const User = db.User;
const Question = db.Question;

export const submitForm = async (req, res) => {
    const { templateId, answers } = req.body;

    try {
        const form = await Form.create({
            userId: req.user.id,
            templateId
        });

        const answerData = answers.map(ans => ({
            formId: form.id,
            questionId: ans.questionId,
            value: ans.value
        }));

        await Answer.bulkCreate(answerData);

        res.status(201).json({ msg: 'Form submitted successfully' });
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to submit form' });
    }
};

export const getAccessibleForms = async (req, res) => {
    try {
      const whereCondition = req.user.role === 'admin' ? {} : {
        [Op.or]: [
          { userId: req.user.id },
          { '$template.userId$': req.user.id }
        ]
      };
  
      const forms = await Form.findAll({
        where: whereCondition,
        include: [
            { model: Template, as: 'template' },
            { model: User, as: 'user' },
            {
              model: Answer,
              as: 'answers',
              include: [
                { model: Question, as: 'question' }
              ]
            }
        ]
      });
  
      res.json(forms);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Failed to fetch forms' });
    }
};

export const getSingleForm = async (req, res) => {
  try {
    const form = await Form.findOne({
      where: { id: req.params.formId },
      include: [
        { model: Template, as: 'template' },
        { model: User, attributes: ['name', 'email'], as: 'user' },
        {
          model: Answer,
          as: 'answers',
          include: { model: Question, as: 'question' }
        }
      ]
    });

    if (!form) return res.status(404).json({ msg: 'Form not found' });

    res.json(form);
  } catch(err) {
    console.error("Error fetching form:", err);
    res.status(500).json({ msg: 'Internal server error' });
  }
} 

export const deleteForms = async (req, res) => {
  const ids = req.body.ids;

  try {
    await Form.destroy({ where: { id: ids } });
    res.json({ msg: 'Deleted successfully' })
  } catch(err) {
    res.status(500).json({ msg: 'Delete failed', error: err.message });
  }
}
