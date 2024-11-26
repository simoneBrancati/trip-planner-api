import CustomError from "./CustomError";

export default class ConflictError extends CustomError {
  errorCode = 409;
  erroType = "CONFLICT";

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ConflictError.prototype);
  }

  public serializeError() {
    return {
      message: this.message,
    };
  }
}
