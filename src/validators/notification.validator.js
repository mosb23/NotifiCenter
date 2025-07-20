const Joi = require('joi');

exports.notificationSchema = Joi.object({
  title: Joi.string().required(),
  content: Joi.string().required(),
  tags: Joi.string().optional(), 
  schedule: Joi.date().iso().optional(),
  status: Joi.string().valid('draft', 'scheduled', 'sent').optional()
});

exports.updateSchema = Joi.object({
  title: Joi.string().optional(),
  content: Joi.string().optional(),
  tags: Joi.string().optional(),
  schedule: Joi.date().iso().optional(),
  status: Joi.string().valid('draft', 'scheduled', 'sent').optional()
});

