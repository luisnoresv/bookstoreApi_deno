import { Router } from '../../utils/deps.ts';
import requiresBody from '../middlewares/requiresBody.ts';
import BookController from './booksController.ts';

const router = new Router();

// TODO : Review the how to implement DI on the right way
// const container = await getContainer();
// const bookController = container.get(BookController);
const bookController = new BookController();

router
	.post('/api/v1/books', requiresBody, bookController.createBook)
	.get('/api/v1/books/:isbn', bookController.getBook)
	.get('/api/v1/books', bookController.getBooks)
	.put('/api/v1/books/:isbn', requiresBody, bookController.updateBook)
	.delete('/api/v1/books/:isbn', bookController.deleteBook);

export default router;
