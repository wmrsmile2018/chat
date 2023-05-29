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
  showSuggestions: boolean;
};

export const Dialog: FC<DialogProps> = memo(
  ({ history, sendMessage, idOwner, showSuggestions }) => {
    const [text, setText] = useState('');
    const [system, setSystem] = useState(
      'always offer several answers, how you can answer the message'
    );
    const suggestions = useStore($suggestion);
    const getSuggest = useEvent(getSuggestionAnswerFx);

    const onChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback(
      ({ target }) => {
        setText(target.value);
      },
      []
    );

    const chooseSuggest = useCallback((value: string) => {
      setText(value);
    }, []);

    const onSubmit: MouseEventHandler<HTMLAnchorElement> &
      MouseEventHandler<HTMLButtonElement> = useCallback(() => {
      getSuggest({ message: text, id: idOwner, systemMessage: system });
      sendMessage({ text, id: idOwner });
      setText('');
    }, [getSuggest, idOwner, sendMessage, system, text]);

    const setSystemMessage: ChangeEventHandler<HTMLTextAreaElement> =
      useCallback(({ target }) => {
        setSystem(target.value);
      }, []);

    return (
      <DialogView
        onSubmit={onSubmit}
        onChange={onChange}
        value={text}
        messages={history}
        idOwner={idOwner}
        suggestions={suggestions}
        chooseSuggest={chooseSuggest}
        showSuggestions={showSuggestions}
        setSystemMessage={setSystemMessage}
        systemMessage={system}
      />
    );
  }
);
