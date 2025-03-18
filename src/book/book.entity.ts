import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, Unique, BeforeUpdate } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
/**
 * Represents a book entity in the database.
 * 
 * @decorator `@ObjectType()`
 * @decorator `@Entity({ name: 'books' })`
 */
@ObjectType()
@Entity({ name: 'books'})
export class BookEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    title: string;

    @Field()
    @Column()
    authors: string;
    /*

    */
    @Field()
    @Column('float')
    average_rating: number;

    @Field()
    @Column({ unique: true })
    isbn: string;

    @Field()
    @Column({ type: 'varchar', length: 13, unique: true })
    isbn13: string;

    @Field()
    @Column()
    language_code: string;

    @Field()
    @Column()
    num_pages: number;

    @Field()
    @Column({ default: 0 })
    ratings_count: number;

    @Field()
    @Column()
    text_reviews_count: number;

    @Field()
    @Column()
    publication_date: Date;

    @Field()
    @Column()
    publisher: string;

    @CreateDateColumn()
    createdAt: Date;

    @BeforeInsert()
    // @BeforeUpdate()
    formatPublicationDate() {
        this.publication_date = new Date(this.publication_date);
    }
}