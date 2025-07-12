const autoBind = require('auto-bind');
const NotFoundError = require('../../exceptions/NotFoundError');
const InvariantError = require('../../exceptions/InvariantError');

class AlbumsHandler {
  constructor(service, validator, storageService, albumLikesService, albumLikesValidator) {
    this._service = service;
    this._validator = validator;
    this._storageService = storageService;
    this._albumLikesService = albumLikesService;
    this._albumLikesValidator = albumLikesValidator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    const albumId = await this._service.createAlbum({ name, year });

    return h.response({
      status: 'success',
      data: { albumId },
    }).code(201);
  }

  async getAlbumByIdHandler(request, h) {
    try {
      const { id } = request.params;
      const album = await this._service.getAlbumById(id);

      return {
        status: 'success',
        data: { album },
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(404);
      }

      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server kami',
      }).code(500);
    }
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { id } = request.params;
    const { name, year } = request.payload;

    await this._service.updateAlbumById(id, { name, year });

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteAlbumById(id);
    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }

  async postUploadCoverHandler(request, h) {
    const { cover } = request.payload;
    const { id } = request.params;

    try {
      console.log('>>> Incoming upload for album:', id);
      console.log('>>> Cover:', cover?.hapi);

      if (!cover || !cover.hapi || !cover._readableState) {
        throw new InvariantError('Berkas tidak ditemukan atau tidak valid');
      }

      this._validator.validateImageHeaders(cover.hapi.headers);

      const filename = await this._storageService.writeFile(cover, cover.hapi);
      const coverUrl = `http://${process.env.HOST}:${process.env.PORT}/uploads/images/${filename}`;

      await this._service.updateAlbumCover(id, coverUrl);

      return h.response({
        status: 'success',
        message: 'Sampul berhasil diunggah',
      }).code(201);

    } catch (error) {
      if (error instanceof InvariantError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(400);
      }

      if (error.output?.statusCode === 413) {
        return h.response({
          status: 'fail',
          message: 'Ukuran file terlalu besar',
        }).code(413);
      }

      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      }).code(500);
    }
  }


  async postAlbumLikeHandler(request, h) {
    try {
      this._albumLikesValidator.validateAlbumLikesParams(request.params);

      const { id: userId } = request.auth.credentials;
      const { id: albumId } = request.params;

      await this._service.isAlbumExist(albumId);
      await this._albumLikesService.likeAlbum(userId, albumId);

      return h.response({
        status: 'success',
        message: 'Berhasil menyukai album',
      }).code(201);
    } catch (error) {
      if (error instanceof NotFoundError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(404);
      }

      if (error instanceof InvariantError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(400);
      }

      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      }).code(500);
    }
  }

  async deleteAlbumLikeHandler(request, h) {
    try {
      this._albumLikesValidator.validateAlbumLikesParams(request.params);

      const { id: userId } = request.auth.credentials;
      const { id: albumId } = request.params;

      await this._service.isAlbumExist(albumId);
      await this._albumLikesService.unlikeAlbum(userId, albumId);

      return {
        status: 'success',
        message: 'Berhasil batal menyukai album',
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        return h.response({
          status: 'fail',
          message: error.message,
        }).code(404);
      }

      return h.response({
        status: 'error',
        message: 'Terjadi kesalahan pada server',
      }).code(500);
    }
  }

  async getAlbumLikesHandler(request, h) {
    this._albumLikesValidator.validateAlbumLikesParams(request.params);
    const { id: albumId } = request.params;

    const result = await this._albumLikesService.getAlbumLikes(albumId);

    const response = h.response({
      status: 'success',
      data: {
        likes: result.likes,
      },
    });

    if (result.source === 'cache') {
      response.header('X-Data-Source', 'cache');
    }

    return response;
  }
}

module.exports = AlbumsHandler;
