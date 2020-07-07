import { Router } from 'https://deno.land/x/oak/mod.ts';

import requiresBody from '../middlewares/requiresBody.ts';
import BookController from './booksController.ts';

const router = new Router();

const bookController = new BookController();

router
  .post('/api/v1/books', requiresBody, bookController.createBook)
  .get('/api/v1/books/:isbn', bookController.getBook)
  .get('/api/v1/books', bookController.getBooks)
  .put('/api/v1/books/:isbn', requiresBody, bookController.updateBook)
  .delete('/api/v1/books/:isbn', bookController.deleteBook);

export default router;
