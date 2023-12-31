import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity()
export class Role {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({
    length: 20,
    comment: '角色名称',
  })
  name: string;
  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permissions',
  })
  permissions: Permission[];

  constructor(partial?: Partial<Role>) {
    if (partial) Object.assign(this, partial);
  }
}
