const Joi = require('joi');

exports.notificationSchema = Joi.object({
  schemaName: Joi.string().required(),
  campaignName: Joi.string().required(),
  title: Joi.string().required(),
  content: Joi.string().required(),
  tags: Joi.string().optional(), 
  schedule: Joi.date().iso().required(),
  status: Joi.string().valid('draft', 'scheduled', 'sent').optional()
});

exports.updateSchema = Joi.object({
  schemaName: Joi.string().optional(),
  campaignName: Joi.string().optional(),
  title: Joi.string().optional(),
  content: Joi.string().optional(),
  tags: Joi.string().optional(),
  schedule: Joi.date().iso().optional(),
  status: Joi.string().valid('draft', 'scheduled', 'sent').optional()
});

