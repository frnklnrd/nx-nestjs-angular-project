import { BaseResource } from '@project/api-core-api';
import { Exclude } from 'class-transformer';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class User extends BaseResource {
  @Column()
  username?: string;

  @Column({ type: 'varchar', length: 100 })
  email?: string;

  @Column()
  @Exclude()
  password?: string;

  @Column({ name: 'is_admin', default: false })
  isAdmin?: boolean;

  @Column({ name: 'is_active', default: true })
  isActive?: boolean;

  @Column({ name: 'is_blocked', default: false })
  isBlocked?: boolean;

  // roles?: string[];

  public getPermissions(): string[] {
    const permissions = [];
    if (this.isActive) {
      permissions.push('ROLE_USER');
      if (this.isAdmin) {
        permissions.push('ROLE_ADMIN');
      }
    }

    return permissions;
  }
}
