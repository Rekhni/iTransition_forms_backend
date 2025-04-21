import db from "../models/index.js";

const Question = db.Question;

export const  addQuestion = async (req, res) => {
    const { templateId } = req.params;
    const { type, title, order, options, showInTable } = req.body;

    try {
        const question = await Question.create({
            templateId,
            type,
            title,
            order,
            options: type === 'checkbox' ? options : null,
            showInTable
        });

        res.status(201).json(question);
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to add a question' })
    }
}

export const getQuestions = async (req, res) => {
    const { templateId } = req.params;

    try {
        const questions = await Question.findAll({
            where: { templateId },
            order: [['order', 'ASC']]
        });

        res.status(201).json(questions);
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to fetch questions' });
    }
};

export const updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { type, title, order, options, showInTable } = req.body;

    try {   
        const question = await Question.findByPk(id);

        if (!question) {
            return res.status(404).json({ msg: 'Question not found' });
        }

        question.type = type;
        question.title = title;
        question.order = order;
        question.showInTable = showInTable;

        if (type === 'checkbox') {
            question.options = options;
        }

        await question.save();
        res.json({ msg: 'Question updated', question });
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to update question' })
    }
}

export const deleteQuestion = async (req, res) => {
    let questionIds = req.params.questionId;
  
    // If it's comma-separated or sent as an array in body
    if (typeof questionIds === 'string' && questionIds.includes(',')) {
      questionIds = questionIds.split(',').map(id => parseInt(id));
    } else if (Array.isArray(req.body.ids)) {
      questionIds = req.body.ids;
    } else {
      questionIds = [parseInt(questionIds)];
    }
  
    try {
      await Question.destroy({ where: { id: questionIds } });
      res.json({ msg: `Deleted ${questionIds.length} question(s)` });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Failed to delete question(s)' });
    }
};