import React, { useContext, useEffect, useState } from 'react';
import { RoomContext } from '../contexts/roomContext';
import { ChatState } from '../../schemas';
import { RightArrow } from '../utils/Svgs';

type Message = {
  label: string,
  name: string,
  message: string
}

function Chat() {

  const roomCtx = useContext(RoomContext);
  const { state, sessionId } = roomCtx!.room!;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [labelColor, setLabelColor] = useState<string>('');
  const [isHover, setIsHover] = useState<boolean>(false);

  useEffect(() => {
    if (state.chats.length > 0) {
      let msgArr: Message[] = [];

      state.chats.forEach((chat: ChatState) => {
        const { label } = state.players.get(chat.id)!;
        const name = sessionId === chat.id ? 'You' : `Player_${label}`;
        msgArr.push({
          label,
          name,
          message: chat.message
        });
      });

      setMessages(msgArr);
    }

    const player = state.players.get(sessionId);
    const matchedColor = matchColor(player!.label);
    setLabelColor(matchedColor);

    state.chats.onAdd = (chat: ChatState) => {
      const { label } = state.players.get(chat.id)!;
      const name = sessionId === chat.id ? 'You' : `Player_${label}`;
      setMessages((prev: Message[]) => (
        [...prev, { label, name, message: chat.message }]
      ));
    }
  }, []);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }

  const submitHandler = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    roomCtx!.room!.send('send_msg', input);
  }

  const matchColor = (label: string) => {
    let color = '';
    switch (label) {
      case 'A':
        color = '#f2aa8e';
        break;
      case 'B':
        color = '#00f24b';
        break;
      case 'C':
        color = '#2540f2';
        break;
    }
    return color;
  }

  const messagesArr = messages.map((msg: Message, i: number) => {
    const nameColor = {
      color: matchColor(msg.label)
    }
    return (
      <div key={i} className='chat-message-group'>
        <div className='chat-player'>
          <span style={nameColor}>{msg.name}</span>
          :
        </div>
        <span className='chat-message'>{msg.message}</span>
      </div>
    );
  });

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        {messagesArr}
      </div>
      <form
        className='chat-input'
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => submitHandler(e)}
      >
        <input
          type='text'
          className='chat-text'
          placeholder='Type a Message'
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => changeHandler(e)}
        />
        <div
          className='chat-send'
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
          onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => submitHandler(e)}
        >
          <RightArrow labelColor={labelColor} isHover={isHover} />
        </div>
      </form>
    </div>
  );
}

export default Chat;
