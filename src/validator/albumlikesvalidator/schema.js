const Joi = require('joi');

const AlbumLikesParamsSchema = Joi.object({
  id: Joi.string().required(), // sesuai dengan parameter route: /albums/{id}/likes
});

module.exports = { AlbumLikesParamsSchema };
