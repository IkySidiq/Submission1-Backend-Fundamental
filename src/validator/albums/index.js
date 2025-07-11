const { AlbumsPayloadSchema } = require('./schema');
const InvariantError = require('../../exceptions/InvariantError');

const AlbumsValidator = {
  validateAlbumPayload: (payload) => {
    const validationResult = AlbumsPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateImageHeaders: (headers) => {
    const contentType = headers['content-type'] || headers['Content-Type'];

    if (!headers || !contentType) {
      throw new InvariantError('Header content-type tidak ditemukan');
    }

    if (!contentType.startsWith('image/')) {
      throw new InvariantError('File harus berupa gambar');
    }
  },
};

module.exports = AlbumsValidator;
