const Joi = require('joi');

const ExportPlaylistPayloadSchema = Joi.object({
  targetEmail: Joi.string().email({ tlds: { allow: false } }).required(),
});

module.exports = ExportPlaylistPayloadSchema;
