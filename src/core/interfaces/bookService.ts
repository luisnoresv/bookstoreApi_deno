import { Book, BookSchema } from '../entities/book.ts';

export interface IBookService {
	addBook(book: Book): Promise<string>;
	getBooks(): Promise<BookSchema[]>;
	getCount(isbn: string): Promise<number>;
	getBookByIsbn(isbn: string): Promise<BookSchema>;
	getBookById(id: string): Promise<BookSchema>;
	updateBook(book: BookSchema): Promise<number>;
	deleteBook(isbn: string): Promise<number>;
}
