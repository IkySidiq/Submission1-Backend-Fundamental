const routes = (handler) => [
  {
    method: 'POST',
    path: '/albums',
    handler: handler.addAlbumsHandler,
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: handler.getAlbumsByIdHandler,
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: handler.editAlbumsHandler,
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: handler.deleteAlbumsHandler,
  },
];
 
module.exports = routes;