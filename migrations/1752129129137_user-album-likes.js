exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.createTable("user_album_likes", {
    id: { type: "varchar(50)", primaryKey: true },
    user_id: { type: "varchar(50)", notNull: true },
    album_id: { type: "varchar(50)", notNull: true },
  });

  pgm.addConstraint(
    "user_album_likes",
    "fk_user_album_likes.user_id_users",
    "FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "user_album_likes",
    "fk_user_album_likes.album_id_albums",
    "FOREIGN KEY(album_id) REFERENCES albums(id) ON DELETE CASCADE"
  );

  pgm.addConstraint(
    "user_album_likes",
    "unique_user_album_like",
    "UNIQUE(user_id, album_id)"
  );
};

exports.down = (pgm) => {
  pgm.dropTable("user_album_likes");
};
