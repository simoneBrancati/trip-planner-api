import CustomError from "./CustomError";

export default class ServerError extends CustomError {
  errorCode = 500;
  erroType = "INTERNAL_SERVER_ERROR";

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, ServerError.prototype);
  }

  public serializeError() {
    return {
      message: this.message,
    };
  }
}
