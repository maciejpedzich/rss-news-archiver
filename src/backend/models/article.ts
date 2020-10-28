import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn
} from 'typeorm';

@Entity({name: 'articles'})
export default class Article {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  dateArchived!: Date;

  @Column('timestamp', { nullable: false })
  datePublished!: Date;

  @Column('text', { nullable: false })
  title!: string;

  @Column('text', { nullable: false })
  description!: string;

  @Column('text', { nullable: false })
  guid!: string;

  @Column('text', { nullable: false })
  link!: string;

  @Column('text')
  imageLink!: string;
}
