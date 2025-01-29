import axios from 'axios';
import {TriviaData} from '../models/trivia-data.type';
import {TrivaApiReponse} from './types/trivia-response.interface';

interface RequestParams extends TriviaData {}

const API_URL = 'https://opentdb.com/api.php';

export const getTrivia = async (
  params: RequestParams,
): Promise<TrivaApiReponse<TriviaData[]>> => {
  try {
    const {data} = await axios.get<TrivaApiReponse<TriviaData[]>>(API_URL, {
      params,
    });
    const info = {
      ...data,
      results: [
        ...(data.results?.map((result, index) => ({
          ...result,
          question: result?.question?.replace(/&quot;/g, '"'),
          id: index,
        })) ?? []),
      ],
    };
    console.log('🚀 ~ getTrivia ~ info:', info);
    return info;
  } catch (error) {
    console.log(error);
    return {
      response_code: 500,
    };
  }
};
