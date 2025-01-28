export interface TrivaApiReponse<T> {
  response_code: number;
  results?: T;
}
