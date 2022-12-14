export default {
  jwt: {
    secret: process.env.JWT_SECRET || 'jwt_secret_fin_api',
    expiresIn: '1d'
  }
}
