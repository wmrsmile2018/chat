import { createEffect, createEvent } from 'effector';
import { createStore } from 'effector';
import { Configuration, OpenAIApi } from 'openai';

export const getSuggestionAnswerFx = createEffect(
  async (params: { message: string; id: string }) => {
    const { id, message } = params;
    const configuration = new Configuration({
      apiKey: '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',
    });

    const openaiApi = new OpenAIApi(configuration);

    const response = await openaiApi.createChatCompletion({
      model: 'gpt-3.5-turbo',
      temperature: 0,
      n: 2,
      messages: [
        // {
        //   role: 'system',
        //   content:
        //     'always offer several answers, how you can answer the message',
        // },
        {
          role: 'user',
          content: message,
        },
      ],
    });

    console.log(
      'response.data?.choices[0].message?.content',
      response.data?.choices[0].message?.content
    );

    return {
      response: (response.data?.choices[0].message?.content ?? '')
        .split(/\d+\.\s*/)
        .slice(1),
      id,
    };
  }
);

//@ts-ignore
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
