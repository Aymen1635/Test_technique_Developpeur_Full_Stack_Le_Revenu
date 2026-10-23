module.exports = ({ env }) => ({
  'users-permissions': {
    config: {
      jwtSecret: env('JWT_SECRET', 'usersJwtSecretKey1234567890'),
    },
  },
});
