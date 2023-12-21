import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Index } from 'typeorm';
import { Classroom } from "./classroom.entity"
import { User } from '../../user/entities/user.entity';
import { IsNotEmpty, IsInt, IsEnum } from 'class-validator';

@Entity()
@Index(['classroomId', 'fileType'])
export class File {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  @IsNotEmpty()
  name: string;

  @Column({ length: 300 })
  description: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  uploadedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'uploaded_by', referencedColumnName: 'id' })
  @IsNotEmpty()
  @IsInt()
  uploadedBy: number;

  @Column()
  @IsNotEmpty()
  @IsEnum(['Image', 'Audio', 'Video', 'URL'])
  fileType: string;

  @ManyToOne(() => Classroom, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'classroom_id' })
  @IsNotEmpty()
  @IsInt()
  classroomId: number;

  @Column()
  @IsNotEmpty()
  url: string;

  @Column({
    type: 'json',
    nullable: true,
  })
  fileDetails: {
    fileType: string;
    fileId: string;
  }
}
