const AlbumsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (
    server,
    {
      service,
      validator,
      storageService,
      albumLikesService,
      AlbumLikesValidator,
    }
  ) => {
    const albumsHandler = new AlbumsHandler(
      service,
      validator,
      storageService,
      albumLikesService,
      AlbumLikesValidator
    );

    server.route(routes(albumsHandler));
  },
};
