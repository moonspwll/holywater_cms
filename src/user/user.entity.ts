import { hash } from 'bcrypt';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserRole } from '@app/user/enums/user.role.enum';

@ObjectType()
@Entity({ name: 'users'})
export class UserEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Field()
    @Column()
    email: string;

    @Field()
    @Column({ default: '' })
    username: string;
    /*

    */
    @Field(() => UserRole)
    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Field()
    @Column({ default: '' })
    bio?: string;

    @Field()
    @Column({ default: '' })
    image?: string;

    @Column({ select: false })
    password?: string;

    @CreateDateColumn()
    createdAt: Date;
    /*

    */
    @BeforeInsert() 
    async hashPassword() {
        this.password = await hash(this.password, 10);
    }
}