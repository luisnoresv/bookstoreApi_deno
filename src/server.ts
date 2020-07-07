import { Application } from 'https://deno.land/x/oak/mod.ts';
import 'https://deno.land/x/denv/mod.ts';
import * as log from 'https://deno.land/std/log/mod.ts';

import { PORT } from './infrastructure/persistence/configuration/dbConfiguration.ts';
import loggerMiddleware from './api/middlewares/logger.ts';
import timingMiddleware from './api/middlewares/timing.ts';
import errorMiddleware from './api/middlewares/error.ts';
import router from './api/controllers/router.ts';
import notFoundMiddleware from './api/middlewares/notFound.ts';
import responseMiddleware from './api/middlewares/response.ts';

const app = new Application();

app.use(responseMiddleware);
app.use(loggerMiddleware);
app.use(timingMiddleware);
app.use(errorMiddleware);
app.use(router.routes());
app.use(router.allowedMethods());
app.use(notFoundMiddleware);

log.info(`Listening on port ${PORT}`);
await app.listen({ port: PORT });
