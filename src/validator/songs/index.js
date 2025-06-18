// validator/songs/index.js

const { MusicsPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const SongsValidator = {
  validateSongPayload: (payload) => {
    const validationResult = MusicsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = SongsValidator;
