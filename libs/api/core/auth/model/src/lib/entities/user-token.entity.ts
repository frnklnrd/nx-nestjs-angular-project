import { BaseResource } from '@project/api-core-api';
import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';

@Entity('user_tokens')
export class UserToken extends BaseResource {
  // ------------------------------------------------------------------------------

  @Column({ name: 'access_token', nullable: true })
  @Exclude()
  accessToken?: string;

  @Column({
    name: 'access_token_updated_at',
    type: 'timestamp',
    nullable: true
  })
  accessTokenUpdatedAt?: Date;

  // ------------------------------------------------------------------------------

  @Column({ name: 'refresh_token', nullable: true })
  @Exclude()
  refreshToken?: string;

  @Column({
    name: 'refresh_token_updated_at',
    type: 'timestamp',
    nullable: true
  })
  refreshTokenUpdatedAt?: Date;

  // ------------------------------------------------------------------------------

  @Column({ name: 'reset_password_token', nullable: true })
  @Exclude()
  resetPasswordToken?: string;

  @Column({
    name: 'reset_password_token_updated_at',
    type: 'timestamp',
    nullable: true
  })
  resetPasswordTokenUpdatedAt?: Date;

  // ------------------------------------------------------------------------------

  @Column({ name: 'access_failed_attempts', type: 'int', nullable: true })
  accessFailedAttempts?: number;

  @Column({
    name: 'access_last_attempt_at',
    type: 'timestamp',
    nullable: true
  })
  accessLastAttemptAt?: Date;

  @Column({
    name: 'access_last_access_at',
    type: 'timestamp',
    nullable: true
  })
  accessLastAccessAt?: Date;

  // ------------------------------------------------------------------------------

  @Column({
    name: 'change_password_failed_attempts',
    type: 'int',
    nullable: true
  })
  changePasswordFailedAttempts?: number;

  @Column({
    name: 'change_password_last_attempt_at',
    type: 'timestamp',
    nullable: true
  })
  changePasswordLastAttemptAt?: Date;

  @Column({
    name: 'change_password_last_change_at',
    type: 'timestamp',
    nullable: true
  })
  changePasswordLastChangeAt?: Date;

  // ------------------------------------------------------------------------------

  @Column({ name: 'reset_password_attempts', type: 'int', nullable: true })
  resetPasswordAttempts?: number;

  @Column({
    name: 'reset_password_last_attempt_at',
    type: 'timestamp',
    nullable: true
  })
  resetPasswordLastAttemptAt?: Date;

  @Column({
    name: 'reset_password_last_reset_at',
    type: 'timestamp',
    nullable: true
  })
  resetPasswordLastResetAt?: Date;

  // ------------------------------------------------------------------------------
}
