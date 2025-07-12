exports.up = (pgm) => {
  pgm.dropConstraint('authentications', 'authentications_pkey');
};

exports.down = (pgm) => {
  pgm.addConstraint('authentications', 'authentications_pkey', {
    primaryKey: ['token'],
  });
};
