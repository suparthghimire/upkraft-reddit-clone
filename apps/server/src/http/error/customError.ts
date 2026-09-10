export class CustomError<T = undefined> extends Error {
  public readonly statusCode: number;
  public readonly data: T | null = null;
  constructor(message: string, statusCode: number, data?: T) {
    super(message);
    this.statusCode = statusCode;
    this.data = data ?? null;
  }
}
