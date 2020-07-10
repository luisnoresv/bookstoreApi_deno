import { RouterMiddleware, Status } from 'https://deno.land/x/oak/mod.ts';
import BookRepository from '../../infrastructure/services/bookRepository.ts';
import { Book } from '../../core/entities/book.ts';
import { Service } from 'https://deno.land/x/di/mod.ts';
import 'https://cdn.pika.dev/@abraham/reflection@^0.7.0';

@Service()
class BookController {
	// private bookRepository: BookRepository;

	constructor(private bookRepository: BookRepository) {
		// this.bookRepository = new BookRepository();
	}

	createBook: RouterMiddleware = async (context) => {
		const body = await context.request.body();
		const book: Book = body.value;

		if (!book.isbn || !book.author || !book.title || !book.url) {
			context.throw(
				Status.BadRequest,
				'Incorrect book data. ISBN, title, url and author are all required'
			);
		}

		const count = await this.bookRepository.getCount(book.isbn);
		if (count > 0) {
			context.throw(
				Status.BadRequest,
				'A book with that isbn already exists'
			);
		}

		const _id = await this.bookRepository.addBook(book);
		book._id = _id;
		context.response.status = Status.Created;
		context.response.body = { ...book };
	};

	getBook: RouterMiddleware = async (context) => {
		const { isbn } = context.params;

		const book = await this.bookRepository.getBookByIsbn(isbn!);
		if (!book) {
			context.throw(Status.NotFound, 'Book not found');
		}

		context.response.status = Status.OK;
		context.response.body = book;
	};

	getBooks: RouterMiddleware = async (context) => {
		const books = await this.bookRepository.getBooks();
		if (!books) {
			context.throw(Status.NotFound, 'There is no books on the Database');
		}

		context.response.status = Status.OK;
		context.response.body = books;
	};

	updateBook: RouterMiddleware = async (context) => {
		const { isbn } = context.params;
		const body = await context.request.body();
		const book: Book = body.value;
		const updates = Object.keys(book);
		const allowedUpdates = ['author', 'title', 'url'];
		const isValidOperation = updates.every((update) =>
			allowedUpdates.includes(update)
		);
		if (!isValidOperation) {
			context.throw(Status.BadRequest, 'Invalid operation');
		}

		// TODO : Review is this logic could be use with MongoDB or should be apply refactoring
		const bookFromRepo = await this.bookRepository.getBookByIsbn(isbn!);
		if (!bookFromRepo) {
			context.throw(Status.NotFound, 'Book not found');
		} else {
			bookFromRepo.author = book.author;
			bookFromRepo.title = book.title;
			bookFromRepo.url = book.url;
			const matchedCount = await this.bookRepository.updateBook(
				bookFromRepo!
			);
			if (matchedCount === 0) {
				context.throw(Status.NotFound, 'Book not found');
			}
		}
		context.response.status = Status.NoContent;
	};

	deleteBook: RouterMiddleware = async (context) => {
		const { isbn } = context.params;

		const deleteCount = await this.bookRepository.deleteBook(isbn!);
		if (deleteCount === 0) {
			context.throw(Status.NotFound, 'Book not found');
		}
		context.response.status = Status.NoContent;
	};
}

export default BookController;
