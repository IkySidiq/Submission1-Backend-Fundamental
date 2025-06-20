require('dotenv').config();

const Hapi = require('@hapi/hapi');
const AlbumsService = require('./services/AlbumsService');
const SongsService = require('./services/SongsService');
const AlbumsValidator = require('./validator/albums');
const SongsValidator = require('./validator/songs');
const ClientError = require('./exceptions/ClientError');

const albums = require('./api/albums');
const songs = require('./api/songs');

const init = async () => {
  const albumsService = new AlbumsService();
  const songsService = new SongsService();

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register({
    plugin: albums,
    options: {
      service: albumsService,
      validator: AlbumsValidator,
    },
  });

  await server.register({
    plugin: songs,
    options: {
      service: songsService,
      validator: SongsValidator,
    },
  });

  //* HAPI Secara otomatis akan melempar semua error ke extension point
  //* HAPI Lifcycle ada banyak, dan onPreResponse adalah lifecycle terakhir. onPreResponse punya makna semantik seperti lifecylce lainnya, jadi tidak dapat dinamakan secara sembarang
  server.ext('onPreResponse', (request, h) => {
    //* response hanya  
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      //* Kalo error muncul dari sisi Hapi, bukan client atau server, maka biarkan Hapi menanggapinya sendiri. isServer akan true jika status code di atas 500, dan false jika dibawah 500. Tidak semua yang di bawah 500 itu dihasilkan karena kesalahan client
      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Maaf, terjadi kegagalan pada server kami.',
      });
      newResponse.code(500);
      console.error(response);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
