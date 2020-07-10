import { Collection } from 'https://deno.land/x/mongo@v0.8.0/mod.ts';
import dbContext from '../persistence/dbContext.ts';
import { Book, BookSchema } from '../../core/entities/book.ts';
import { Service } from 'https://deno.land/x/di/mod.ts';
import 'https://cdn.pika.dev/@abraham/reflection@^0.7.0';

@Service()
class BookRepository {
	private booksCollection: Collection;

	constructor() {
		this.booksCollection = dbContext.database.collection('books');
	}

	addBook = async (book: Book): Promise<string> => {
		const { $oid } = await this.booksCollection.insertOne(book);
		return $oid;
	};

	getBooks = async () => {
		const booksResponse: Book[] = [];
		const books: BookSchema[] = await this.booksCollection.find();
		if (books.length > 0) {
			books.forEach((book) => {
				const bookResponse: Book = {
					_id: book._id.$oid,
					author: book.author,
					isbn: book.isbn,
					title: book.title,
					url: book.url,
				};
				booksResponse.push(bookResponse);
			});
		}
		return booksResponse;
	};

	getCount = async (isbn: string) =>
		await this.booksCollection.count({ isbn });

	getBookByIsbn = async (isbn: string) => {
		const book: BookSchema = await this.booksCollection.findOne({ isbn });
		if (book) {
			const bookResponse: Book = {
				_id: book._id.$oid,
				author: book.author,
				isbn: book.isbn,
				title: book.title,
				url: book.url,
			};
			return bookResponse;
		}
	};

	getBookById = async (id: string) => {
		const book: BookSchema = await this.booksCollection.findOne({
			_id: { $oid: id },
		});
		if (book) {
			const bookResponse: Book = {
				_id: book._id.$oid,
				author: book.author,
				isbn: book.isbn,
				title: book.title,
				url: book.url,
			};
			return bookResponse;
		}
	};

	updateBook = async (book: Book) => {
		const { matchedCount } = await this.booksCollection.updateOne(
			{
				_id: { $oid: book._id },
			},
			{
				$set: {
					name: book.title,
					url: book.url,
					author: book.author,
					isbn: book.isbn,
				},
			}
		);
		return matchedCount;
	};

	deleteBook = async (isbn: string) => {
		const deleteCount = await this.booksCollection.deleteOne({ isbn });
		return deleteCount;
	};
}

export default BookRepository;
