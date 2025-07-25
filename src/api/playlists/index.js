const PlaylistsHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'playlists',
  version: '1.0.0',
  register: async (server, { service, playlistSongsService, validator, playlistSongsValidator }) => {
    const playlistsHandler = new PlaylistsHandler(
      service,
      playlistSongsService,
      validator,
      playlistSongsValidator,
    );
    server.route(routes(playlistsHandler));
  },
};
