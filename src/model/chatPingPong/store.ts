import { createEvent } from 'effector';
import { createStore, sample } from 'effector';

export const sendMessage = createEvent<{ id: string; text: string }>();

export const $chat = createStore<Array<{ id: string; text: string }>>([]);

sample({
  clock: sendMessage,
  source: $chat,
  fn: (source, clock) => {
    return [...source, { id: clock.id, text: clock.text }];
  },
  target: $chat,
});
