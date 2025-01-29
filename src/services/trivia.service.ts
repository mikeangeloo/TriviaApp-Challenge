import axios from 'axios';
import {TriviaCategory, TriviaData} from '../models/trivia-data.type';
import {
  TrivaApiReponse,
  TriviaApiCategoryResponse,
} from './types/trivia-response.interface';
import {sanitizeText} from '../utils/sanitize-text';

interface RequestParams extends TriviaData {}

const API_URL = 'https://opentdb.com';

export const getCategories = async (): Promise<TriviaCategory[]> => {
  try {
    const {data} = await axios.get<TriviaApiCategoryResponse<TriviaCategory[]>>(
      `${API_URL}/api_category.php`,
    );
    return data.trivia_categories ?? [];
  } catch (error) {
    console.error(error);
    const staticCategories: TriviaCategory[] = [
      {
        id: '9',
        name: 'General Knowledge',
      },
      {
        id: '10',
        name: 'Entertainment: Books',
      },
      {
        id: '17',
        name: 'Science & Nature',
      },
    ];
    return staticCategories;
  }
};

export const getTrivia = async (
  params: RequestParams,
): Promise<TrivaApiReponse<TriviaData[]>> => {
  try {
    const {data} = await axios.get<TrivaApiReponse<TriviaData[]>>(
      `${API_URL}/api.php`,
      {
        params,
      },
    );

    const info = {
      ...data,
      results:
        data.results?.map((result, index) => {
          const {category, question, correct_answer, incorrect_answers} =
            result;
          return {
            ...result,
            category: sanitizeText(category),
            question: sanitizeText(question),
            correct_answer: sanitizeText(correct_answer),
            incorrect_answers: incorrect_answers?.map(sanitizeText) ?? [],
            id: index,
          };
        }) ?? [],
    };
    return info;
  } catch (error) {
    console.error(error);
    return {
      response_code: 500,
    };
  }
};
