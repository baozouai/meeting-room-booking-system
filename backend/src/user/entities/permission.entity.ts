import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Permission {
  @PrimaryGeneratedColumn()
  id: string;
  @Column({
    length: 20,
    comment: '权限代码',
  })
  code: string;
  @Column({
    length: 100,
    comment: '权限描述',
  })
  description: string;

  constructor(partial?: Partial<Permission>) {
    if (partial) Object.assign(this, partial);
  }
}
