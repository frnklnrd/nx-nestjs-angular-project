import { join } from 'path';

export default () => ({
  env: process.env.NODE_ENV || 'development',
  production: process.env.NODE_ENV === 'production',
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
    },
    reset_password: {
      confirm: {
        app_url:
          (process.env.APP_SERVER_HOST as string) +
          (process.env.APP_RESET_PASSWORD_CONFIRM_URL as string)
      }
    }
  },
  encrypt: {
    algorithm: process.env.ENCRYPT_ALGORITHM as string,
    secret: process.env.ENCRYPT_SECRET as string
  },
  mailer: {
    transports: {
      default: {
        host: process.env.MAIL_HOST as string,
        port: process.env.MAIL_POST as string,
        secure: (process.env.MAIL_SECURE as string) == '1',
        ignoreTLS: !((process.env.MAIL_SECURE as string) == '1'),
        auth: {
          user: process.env.MAIL_USER as string,
          pass: process.env.MAIL_PASSWORD as string
        }
      }
      /*
      other: process.env.MAIL_TRANSPORT as string
      */
    },
    defaults: {
      from:
        '"' +
        process.env.MAIL_FROM_NAME +
        '" <' +
        process.env.MAIL_FROM_EMAIL +
        '>'
    },
    preview:
      (process.env.MAIL_PREVIEW as string) === '1' &&
      process.env.NODE_ENV === 'development',
    template: {
      dir: join(__dirname, 'templates'),
      adapter: 'handlerbars',
      options: {
        strict: true
      }
    }
  }
});
