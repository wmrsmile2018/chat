import { createEffect } from 'effector';
import { createStore } from 'effector';
import { Configuration, OpenAIApi } from 'openai';

export const getSuggestionAnswerFx = createEffect(
  async (params: { message: string; id: string; systemMessage: string }) => {
    const { id, message, systemMessage } = params;
    const configuration = new Configuration({
      apiKey: process.env.REACT_APP_API_KEY,
    });

    const openaiApi = new OpenAIApi(configuration);

    const response = await openaiApi.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      n: 2,
      messages: [
        { role: 'system', content: systemMessage },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    return {
      response:
        response.data?.choices.map((choice) => choice.message?.content ?? '') ??
        [],
      id,
    };
  }
);

export const $suggestion = createStore<{
  isLoading: boolean;
  suggestions: string[];
  id: string;
}>({
  isLoading: false,
  suggestions: [],
  id: '',
})
  .on(getSuggestionAnswerFx.pending, (state, payload) => {
    if (payload) {
      return { isLoading: payload, suggestions: [], id: '' };
    }
    return { ...state, isLoading: payload };
  })
  .on(getSuggestionAnswerFx.doneData, (_, payload) => {
    console.log('payload', payload);

    return {
      isLoading: false,
      suggestions: payload.response,
      id: payload.id,
    };
  })
  .on(getSuggestionAnswerFx.failData, () => {
    return {
      isLoading: false,
      suggestions: [],
      id: '',
    };
  });
