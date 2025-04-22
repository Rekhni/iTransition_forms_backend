import db from "../models/index.js";
import { Op } from "sequelize";

const Template = db.Template;

export const createTemplate = async (req, res) => {
    const { title, description, topic, tags, imageUrl } = req.body;

    try {
        const template = await Template.create({
            title,
            description,
            topic,
            tags: tags.join(", "),
            imageUrl,
            userId: req.user.id
        });


        res.status(201).json(template);
    } catch(err) {
        console.error('❌ Template creation failed:', err);
        res.status(500).json({
          msg: 'Template creation failed',
          error: err.message,
          stack: err.stack
        });
    }
};

export const getUserTemplates = async (req, res) => {
    try {
        const templates = await Template.findAll({
            where: { userId: req.user.id }
        });

        res.json(templates);
    } catch(err) {
        console.error(err);
        res.status(500).json({ msg: 'Failed to fetch templates' });
    }
};

export const getTemplateById = async (req, res) => {
    try {
        const template = await Template.findByPk(req.params.id);

        if (!template) {
            return res.status(404).json({ msg: 'Template not found' });
        }

        res.json(template);
    } catch(err) {
        console.error('Error fetching template:',err);
        res.status(500).json({ msg: 'Server error' });
    }
}

export const getAllTemplates = async (req, res) => {
    try {
      const templates = await Template.findAll({
        order: [['createdAt', 'DESC']]
      });
  
      res.json(templates);
    } catch (err) {
      console.error('Error fetching all templates:', err);
      res.status(500).json({ msg: 'Failed to fetch templates' });
    }
  };

export const updateTemplate = async (req, res) => {
    const { id } = req.params;
    const { title, description, topic, imageUrl, tags } = req.body;

    try {
        const template = await Template.findByPk(id);

        console.log("User trying to update:", req.user);
        console.log("Template owner:", template.userId);

        if (!template) {
            return res.status(404).json({ msg: 'Template not found' })
        }

        template.title = title || template.title;
        template.description = description || template.description;
        if (topic !== undefined) template.topic = topic;
        template.imageUrl = imageUrl || template.imageUrl;
        template.tags = Array.isArray(tags) ? tags.join(', ') : tags;

        await template.save();

        res.json(template);

    } catch(err) {
        console.error("❌ Update failed:", err);
        res.status(500).json({
          msg: "Failed to update template",
          error: err.message,
          stack: err.stack,
        });

    }
};

export const searchTemplatesByTag = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ msg: 'Query is required' });
    }

    try {
        const [fulltextResults] = await db.sequelize.query(
            `SELECT * FROM Templates WHERE MATCH(tags) AGAINST(:query IN BOOLEAN MODE)`,
            {
                replacements: { query: `${query}*` },
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        if (fulltextResults.length > 0) {
            return res.json(fulltextResults);
        }

        const likeResults = await db.Template.findAll({
            where: {
                tags: {
                  [Op.like]: `%${query}%`
                }
              }
        });

        res.json(likeResults);
    } catch(err) {
        console.error("Tag search failed:", err);
        res.status(500).json({ msg: 'Internal server error' });

    }
};

export const deleteTemplate = async (req, res) => {
    const { id } = req.params;
    const user = req.user;

    try {
        const template = await Template.findByPk(id);

        if (!template) return res.status(404).json({ msg: 'Template not found' });

        await template.destroy();
        res.json({ msg: 'Template deleted' });
        
    } catch(err) {
        console.error('Failed to delete template:', err);
        res.status(500).json({ msg: 'Server error' });
    }
}

