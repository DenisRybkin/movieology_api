import { HandlerDescriptor } from './types/handler-descriptor.type';
import { ApiError } from '../exceptions/api-error.exception';

const defaultErrorMessage = 'Oooops, something went wrong!';

export const CatchErrors =
  (useNext: boolean | undefined = true) =>
  (target: any, key: string | Symbol, descriptor: HandlerDescriptor) => {
    const method = descriptor.value;

    descriptor.value = async function (...args) {
      try {
        await method.apply(this, args);
      } catch (e) {
        const [, res, next] = args;

        if (useNext) next(new ApiError(500, defaultErrorMessage));
        else res.status(400).json({ message: defaultErrorMessage });
      }
    };
  };