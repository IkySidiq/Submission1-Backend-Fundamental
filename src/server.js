require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// Services
const AlbumsService = require('./services/AlbumsService');
const SongsService = require('./services/SongsService');
const UsersService = require('./services/UsersService');
const AuthenticationsService = require('./services/AuthenticationsService');
const PlaylistsService = require('./services/PlaylistsService');
const PlaylistSongsService = require('./services/PlaylistSongsService');
const CollaborationsService = require('./services/CollaborationsService');
const LocalStorageService = require('./services/StorageService');
const AlbumLikesService = require('./services/AlbumLikesService');
const CacheService = require('./services/CacheService');
const ExportService = require('./services/ProducerService');

// Validators
const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const UsersValidator = require('./validator/users');
const AuthenticationsValidator = require('./validator/authentications');
const PlaylistsValidator = require('./validator/playlists');
const CollaborationsValidator = require('./validator/collaborations');
const PlaylistSongsValidator = require('./validator/playlistsongs');
const AlbumLikesValidator = require('./validator/albumlikesvalidator');
const ExportsValidator = require('./validator/exports');

// Plugins
const albums = require('./api/albums');
const songs = require('./api/songs');
const users = require('./api/users');
const authentications = require('./api/authentications');
const playlists = require('./api/playlists');
const collaborations = require('./api/collaborations');
const exportsPlugin = require('./api/exports');

// Utils
const TokenManager = require('./tokenize/TokenManager');
const ClientError = require('./exceptions/ClientError');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const playlistSongsService = new PlaylistSongsService();
  const storageService = new LocalStorageService(path.resolve(__dirname, 'api/albums/file/images'));
  const cacheService = new CacheService();
  const albumLikesService = new AlbumLikesService(cacheService); 
  const exportService = ExportService;

  const server = Hapi.server({
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([Jwt, Inert]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        service: albumsService,
        validator: AlbumsValidator,
        storageService,
        albumLikesService,
        AlbumLikesValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        playlistSongsService,
        validator: PlaylistsValidator,
        playlistSongsValidator: PlaylistSongsValidator,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistsService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: exportsPlugin,
      options: {
        exportsService: exportService,
        playlistsService,
        validator: ExportsValidator,
      },
    },
  ]);

  server.route({
    method: 'GET',
    path: '/uploads/images/{param*}',
    handler: {
      directory: {
        path: path.resolve(__dirname, 'api/albums/file/images'),
        listing: false,
      },
    },
  });

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        return h
          .response({
            status: 'fail',
            message: response.message,
          })
          .code(response.statusCode);
      }

      if (!response.isServer) return h.continue;

      console.error(response);
      return h
        .response({
          status: 'error',
          message: 'Maaf, terjadi kegagalan pada server kami.',
        })
        .code(500);
    }

    return h.continue;
  });

  await server.start();
  console.log(`\n✅ Server berjalan pada ${server.info.uri}`);
};

init();
