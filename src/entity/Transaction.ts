import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  date!: string;

  @Column()
  author!: string;

  @Column("decimal")
  sum!: number;

  @Column()
  category!: string;

  @Column()
  comment!: string;
}
