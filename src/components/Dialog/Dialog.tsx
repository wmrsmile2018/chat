import {
  ChangeEventHandler,
  FC,
  MouseEventHandler,
  memo,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { DialogView } from './components/DialogView';
import { $suggestion, getSuggestionAnswerFx } from './model/chatGpt/store';
import { useEvent, useStore } from 'effector-react';

export type DialogProps = {
  history: {
    id: string;
    text: string;
  }[];
  sendMessage: (params: { id: string; text: string }) => {
    id: string;
    text: string;
  };
  idOwner: string;
};

export const Dialog: FC<DialogProps> = memo(
  ({ history, sendMessage, idOwner }) => {
    const [text, setText] = useState('');
    const suggestions = useStore($suggestion);
    const getSuggest = useEvent(getSuggestionAnswerFx);

    const onChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
      ({ target }) => {
        setText(target.value);
      },
      []
    );

    const chooseSuggest = (value: string) => {
      setText(value);
    };

    const onSubmit: MouseEventHandler<HTMLAnchorElement> &
      MouseEventHandler<HTMLButtonElement> = useCallback(() => {
      getSuggest({ message: text, id: idOwner });
      sendMessage({ text, id: idOwner });
      setText('');
    }, [getSuggest, idOwner, sendMessage, text]);

    return (
      <DialogView
        onSubmit={onSubmit}
        onChange={onChange}
        value={text}
        messages={history}
        idOwner={idOwner}
        suggestions={suggestions}
        chooseSuggest={chooseSuggest}
      />
    );
  }
);
