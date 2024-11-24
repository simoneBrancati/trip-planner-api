import CustomError from "./CustomError";

export default class NotFoundError extends CustomError {
  errorCode = 404;
  erroType = "NOT_FOUND_ERROR";

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  public serializeError() {
    return {
      message: this.message,
    };
  }
}
