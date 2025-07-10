exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable('authentications', {
    token: { type: 'text', primaryKey: true },
    created_at: { type: 'timestamp', default: pgm.func('current_timestamp') },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('authentications');
};
