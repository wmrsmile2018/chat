import React from 'react';
import './App.css';
import { Dialog } from './components/Dialog';
import { useEvent, useStore } from 'effector-react';
import { $chat, sendMessage } from './model/chatGpt/store';
// import { $chat, fetchFx } from './model/chatGpt/store';
// import { useEvent, useStore } from 'effector-react';

function App() {
  // const fetch = useEvent(fetchFx);
  // const chat = useStore($chat);
  const send = useEvent(sendMessage);
  const history = useStore($chat);

  // useEffect(() => {
  //   fetch([{ content: 'hello', role: 'user' }]);
  // }, [fetch]);
  // useEffect(() => {
  //   console.log('chat', chat);
  // }, [chat]);

  return (
    <div className='App'>
      <Dialog history={history} sendMessage={send} idOwner='1' />
      <Dialog history={history} sendMessage={send} idOwner='2' />
    </div>
  );
}

export default App;
