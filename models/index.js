import sequelize from "../config/db.js";
import User from "./user.js";
import Template from "./template.js";
import Question from "./question.js";
import Form from "./form.js";
import Answer from "./answer.js";
import Like from "./like.js";
import Comment from "./comment.js";

User.hasMany(Template, { foreignKey: 'userId', as: 'templates' });
Template.belongsTo(User, { foreignKey: 'userId', as: 'author' }); // only once!

// TEMPLATE ⬌ QUESTION
Template.hasMany(Question, { foreignKey: 'templateId', as: 'questions' });
Question.belongsTo(Template, { foreignKey: 'templateId' });

// FORM ⬌ USER / TEMPLATE
User.hasMany(Form, { foreignKey: 'userId' });
Template.hasMany(Form, { foreignKey: 'templateId' });
Form.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Form.belongsTo(Template, { foreignKey: 'templateId', as: 'template' });

// FORM ⬌ ANSWERS
Form.hasMany(Answer, { foreignKey: 'formId', as: 'answers' });
Answer.belongsTo(Form, { foreignKey: 'formId' });

// QUESTION ⬌ ANSWERS
Question.hasMany(Answer, { foreignKey: 'questionId', as: 'answers' });
Answer.belongsTo(Question, { foreignKey: 'questionId', as: 'question' });

User.hasMany(Comment, { foreignKey: 'userId' });
Comment.belongsTo(User, { foreignKey: 'userId' });

Template.hasMany(Comment, { foreignKey: 'templateId' });
Comment.belongsTo(Template, { foreignKey: 'templateId' });

User.hasMany(Like, { foreignKey: 'userId' });
Template.hasMany(Like, { foreignKey: 'templateId' });

Like.belongsTo(User, { foreignKey: 'userId' });
Like.belongsTo(Template, { foreignKey: 'templateId' });

const db = {
    sequelize,
    User,
    Template,
    Question,
    Form,
    Answer,
    Like,
    Comment
};

export default db;