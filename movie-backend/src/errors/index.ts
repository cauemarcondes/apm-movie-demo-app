export class ParamsNotAllowedError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = "ParamsNotAllowedError";
  }
}

export class MovieNotFoundError extends Error {
  constructor(params: string) {
    super(`No movies found for ${params}`);
    this.name = "MovieNotFoundError";
  }
}
