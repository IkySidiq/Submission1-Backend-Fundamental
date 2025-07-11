const InvariantError = require('../../exceptions/InvariantError');
const { AlbumLikesParamsSchema } = require('./schema');

const AlbumLikesValidator = {
  validateAlbumLikesParams: (params) => {
    const validationResult = AlbumLikesParamsSchema.validate(params, { allowUnknown: true }); // allowUnknown opsional
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = AlbumLikesValidator;
