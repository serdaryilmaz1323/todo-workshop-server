export class HttpError extends Error {
  code: number;
  constructor(message: string, errorCode: number = 500) {
    super(message);
    this.code = errorCode;
  }
}
