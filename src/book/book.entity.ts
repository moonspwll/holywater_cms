import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, CreateDateColumn, Index, In } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
/**
 * Represents a book entity in the database.
 * 
 * @decorator `@ObjectType()`
 * @decorator `@Entity({ name: 'books' })`
 */
@ObjectType()
@Entity({ name: 'books'})
// title = '',
//           authors = '',
//           average_rating = 0,
//           num_pages = 0,
//           publication_date,
export class BookEntity {
    @Field(() => ID)
    @PrimaryGeneratedColumn()
    id: number;

    @Field()
    @Column()
    @Index('idx_title', { fulltext: true })
    title: string;

    @Field()
    @Column()
    @Index('idx_authors', { fulltext: true })
    authors: string;
    /*

    */
    @Field()
    @Column('float')
    @Index('idx_average_rating')
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
    @Index('idx_num_pages')
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

    @Field(() => ID)
    @Column('uuid')
    user_id: string;

    @CreateDateColumn()
    createdAt: Date;

    
    @BeforeInsert()
    formatPublicationDate(): void {
        this.publication_date = new Date(this.publication_date);
    }
}