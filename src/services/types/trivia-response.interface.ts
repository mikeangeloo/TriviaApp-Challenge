export interface TrivaApiReponse<T> {
  response_code: number;
  results?: T;
}

export interface TriviaApiCategoryResponse<T> {
  trivia_categories?: T;
}
