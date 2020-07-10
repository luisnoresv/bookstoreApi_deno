import { Router } from 'https://deno.land/x/oak/mod.ts';

import { ServiceCollection } from 'https://deno.land/x/di/mod.ts';
import 'https://cdn.pika.dev/@abraham/reflection@^0.7.0';

import requiresBody from '../middlewares/requiresBody.ts';
import BookController from './booksController.ts';
import BookRepository from '../../infrastructure/services/bookRepository.ts';

const router = new Router();

// TODO : Review the how to implement DI on the right way

const serviceCollection = new ServiceCollection();
serviceCollection.addScoped(BookRepository);

const bookRepository = serviceCollection.get(BookRepository);

const bookController = new BookController(bookRepository);

router
	.post('/api/v1/books', requiresBody, bookController.createBook)
	.get('/api/v1/books/:isbn', bookController.getBook)
	.get('/api/v1/books', bookController.getBooks)
	.put('/api/v1/books/:isbn', requiresBody, bookController.updateBook)
	.delete('/api/v1/books/:isbn', bookController.deleteBook);

export default router;
