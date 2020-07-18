import { RouterMiddleware, Status } from '../../utils/deps.ts';
import BookService from '../../infrastructure/services/bookService.ts';
import { Book } from '../../core/entities/book.ts';
import { IBookService } from '../../core/interfaces/bookService.ts';

class BookController {
	private bookService: IBookService;

	constructor() {
		this.bookService = new BookService();
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

		const count = await this.bookService.getCount(book.isbn);
		if (count > 0) {
			context.throw(Status.BadRequest, 'A book with that isbn already exists');
		}

		const _id = await this.bookService.addBook(book);
		book._id = _id;
		context.response.status = Status.Created;
		context.response.body = { ...book };
	};

	getBook: RouterMiddleware = async (context) => {
		const { isbn } = context.params;

		const book = await this.bookService.getBookByIsbn(isbn!);
		if (!book) {
			context.throw(Status.NotFound, 'Book not found');
		}
		const bookResponse: Book = {
			_id: book._id.$oid,
			author: book.author,
			isbn: book.isbn,
			title: book.title,
			url: book.url,
		};

		context.response.status = Status.OK;
		context.response.body = bookResponse;
	};

	getBooks: RouterMiddleware = async (context) => {
		const books = await this.bookService.getBooks();

		if (!books) {
			context.throw(Status.NotFound, 'There is no books on the Database');
		}

		const booksResponse: Book[] = [];

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

		context.response.status = Status.OK;
		context.response.body = booksResponse;
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
		const bookFromRepo = await this.bookService.getBookByIsbn(isbn!);
		if (!bookFromRepo) {
			context.throw(Status.NotFound, 'Book not found');
		} else {
			bookFromRepo.author = book.author;
			bookFromRepo.title = book.title;
			bookFromRepo.url = book.url;
			const matchedCount = await this.bookService.updateBook(bookFromRepo);
			if (matchedCount === 0) {
				context.throw(Status.NotFound, 'Book not found');
			}
		}
		context.response.status = Status.NoContent;
	};

	deleteBook: RouterMiddleware = async (context) => {
		const { isbn } = context.params;

		const deleteCount = await this.bookService.deleteBook(isbn!);
		if (deleteCount === 0) {
			context.throw(Status.NotFound, 'Book not found');
		}
		context.response.status = Status.NoContent;
	};
}

export default BookController;
