import { Middleware, log, isHttpError, Status } from '../../utils/deps.ts'

const errorMiddleware: Middleware = async ({ response }, next) => {
  try {
    await next()
  } catch (error) {
    log.error(error)
    if (isHttpError(error)) {
      response.status = error.status
      response.body = { code: error.status, message: error.message }
    } else {
      response.status = Status.InternalServerError
      response.body = {
        code: Status.InternalServerError,
        message: 'Internal Server Error',
      }
    }
  }
}

export default errorMiddleware
