import { Collection } from '../../utils/deps.ts';
import dbContext from '../persistence/dbContext.ts';
import { Book, BookSchema } from '../../core/entities/book.ts';
import { IBookService } from '../../core/interfaces/bookService.ts';

class BookService implements IBookService {
	private booksCollection: Collection;

	constructor() {
		this.booksCollection = dbContext.database.collection('books');
	}

	addBook = async (book: Book): Promise<string> => {
		const { $oid } = await this.booksCollection.insertOne(book);
		return $oid;
	};

	getBooks = async () => {
		const books: BookSchema[] = await this.booksCollection.find();
		return books;
	};

	getCount = async (isbn: string) => await this.booksCollection.count({ isbn });

	getBookByIsbn = async (isbn: string) => {
		const book: BookSchema = await this.booksCollection.findOne({ isbn });
		return book;
	};

	getBookById = async (id: string) => {
		const book: BookSchema = await this.booksCollection.findOne({
			_id: { $oid: id },
		});

		return book;
	};

	updateBook = async (book: BookSchema) => {
		const { matchedCount } = await this.booksCollection.updateOne(
			{
				_id: book._id,
			},
			{
				$set: {
					title: book.title,
					url: book.url,
					author: book.author,
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

export default BookService;
