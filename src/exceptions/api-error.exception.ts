export class ApiError extends Error {
  status: number;
  errors?: Error[];

  constructor(status: number, message: string, errors: Error[] = []) {
    super(message);
    this.errors = errors;
    this.status = status;
  }
}