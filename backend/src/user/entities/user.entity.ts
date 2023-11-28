import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Role } from './role.entity';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { createHash } from 'crypto';
import { StringNotEmptyWithLen } from 'src/common/decorator';
export function md5(str: string) {
  const hash = createHash('md5');
  return hash.update(str).digest('hex');
}

@Entity()
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @StringNotEmptyWithLen('用户名', 4, 50)
  @Column({
    length: 50,
    comment: '用户名',
  })
  username: string;
  @StringNotEmptyWithLen('密码', 6, 50)
  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  @BeforeInsert()
  encryPassword() {
    this.password = md5(this.password);
  }

  @IsEmail()
  @Column({
    length: 50,
    comment: '邮箱',
  })
  email: string;

  @IsPhoneNumber('CN')
  @Column({
    length: 20,
    comment: '手机号',
    nullable: true,
  })
  phone_number: string;

  @Column({
    length: 100,
    comment: '头像',
    nullable: true,
  })
  avatar: string;

  @StringNotEmptyWithLen('昵称', 6, 50)
  @Column({
    length: 50,
    comment: '昵称',
  })
  nickname: string;

  @Column({
    comment: '是否被冻结',
    default: false,
  })
  is_frozen: boolean;
  @Column({
    comment: '是否是管理员',
    default: false,
  })
  is_admin: boolean;

  @CreateDateColumn({
    comment: '创建时间',
    type: 'timestamp',
  })
  create_time: Date;

  @UpdateDateColumn({
    comment: '更新时间',
    type: 'timestamp',
  })
  update_time: Date;

  @ManyToMany(() => Role)
  @JoinTable({
    name: 'user_roles',
  })
  roles: Role[];
}
