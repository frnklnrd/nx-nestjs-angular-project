export default () => ({
  port: parseInt(process.env.PORT as string, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST as string,
    port: parseInt(process.env.DATABASE_PORT as string, 10) || 3306,
    name: process.env.DATABASE_NAME as string,
    user: process.env.DATABASE_USER as string,
    password: process.env.DATABASE_PASSWORD as string
  },
  jwt: {
    access_token: {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET as string,
      expires_in: process.env.JWT_ACCESS_TOKEN_EXPIRES_IN as string
    },
    refresh_token: {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
      expires_in: process.env.JWT_REFRESH_TOKEN_EXPIRES_IN as string
    },
    reset_password: {
      secret: process.env.JWT_RESET_PASSWORD_SECRET as string,
      expires_in: process.env.JWT_RESET_PASSWORD_EXPIRES_IN as string
    }
  },
  security: {
    max_allowed_attempts: {
      sign_in:
        parseInt(process.env.MAX_ALLOWED_ATTEMPTS_FOR_SIGN_IN as string, 10) ||
        3,
      change_password:
        parseInt(
          process.env.MAX_ALLOWED_ATTEMPTS_FOR_CHANGE_PASSWORD as string,
          10
        ) || 3,
      reset_password:
        parseInt(
          process.env.MAX_ALLOWED_ATTEMPTS_FOR_RESET_PASSWORD as string,
          10
        ) || 3
    }
  },
  encrypt: {
    algorithm: process.env.ENCRYPT_ALGORITHM as string,
    secret: process.env.ENCRYPT_SECRET as string
  }
});
