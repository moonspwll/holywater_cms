import { hash } from 'bcrypt';
import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { UserRole } from '@app/user/enums/user.role.enum';

/**
 * Represents a user entity in the system.
 * 
 * @remarks
 * This class is used to define the structure of the user entity and its corresponding database table.
 * It includes fields for the user's ID, email, username, role, bio, image, password, token, and creation date.
 * The password is hashed before being inserted into the database.
 *
 */
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

    /**
     * The role of the user within the system.
     * 
     * @type {UserRole}
     * @default UserRole.USER
     * 
     * @remarks
     * This field is an enum type that represents the user's role. 
     * The default value is set to `UserRole.USER`.
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

    @Field()
    token: string

    @CreateDateColumn()
    createdAt: Date;
    
    @BeforeInsert() 
    /**
     * Hashes the user's password using a salt factor of 10.
     * This method should be called before saving the user entity to the database
     * to ensure the password is securely hashed.
     *
     * @returns {Promise<void>} A promise that resolves when the password has been hashed.
     */
    async hashPassword() {
        this.password = await hash(this.password, 10);
    }
}