import React, { FC, memo } from 'react';
import './styles.scss';
import { Button, Input } from 'antd';

export type DialogViewProps = {
  onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
  onSubmit: React.MouseEventHandler<HTMLAnchorElement> &
    React.MouseEventHandler<HTMLButtonElement>;
  value: string;
  messages: Array<{
    id: string;
    text: string;
  }>;
  idOwner: string;
  suggestions: {
    isLoading: boolean;
    suggestions: string[];
    id: string;
  };
  chooseSuggest: (value: string) => void;
  showSuggestions: boolean;
  setSystemMessage: React.ChangeEventHandler<HTMLTextAreaElement>;
  systemMessage: string;
};
export const DialogView: FC<DialogViewProps> = memo(
  ({
    onChange,
    value,
    onSubmit,
    messages,
    idOwner,
    suggestions,
    chooseSuggest,
    showSuggestions,
    setSystemMessage,
    systemMessage,
  }) => {
    return (
      <div className='dialog'>
        {showSuggestions && (
          <div className='dialog_system_message'>
            <Input.TextArea
              autoSize={{ minRows: 1, maxRows: 10 }}
              onChange={setSystemMessage}
              value={systemMessage}
            />
          </div>
        )}
        <div className='dialog_messages'>
          {messages.map((message, i) => {
            const className = `dialog_message ${
              message.id === idOwner ? 'owner' : 'their'
            }`;
            return (
              <div key={i} className={className}>
                {message.text}
              </div>
            );
          })}
        </div>
        <div className='dialog_input'>
          <Input.TextArea
            autoSize={{ minRows: 1, maxRows: 10 }}
            onChange={onChange}
            value={value}
          />
          <Button className='dialog_submit' onClick={onSubmit}>
            send
          </Button>
        </div>
        {showSuggestions && suggestions.id !== idOwner && (
          <div className='dialog_suggestion'>
            {suggestions.suggestions.map((suggest, i) => {
              return (
                <div
                  className='dialog_suggest'
                  onClick={() => chooseSuggest(suggest)}
                  key={i}
                >
                  {suggest}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
);
