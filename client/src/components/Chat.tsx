import React, { useContext, useEffect, useState } from 'react';
import { RoomContext } from '../contexts/roomContext';
import { RightArrow } from '../utils/Svgs';

function Chat() {

  const roomCtx = useContext(RoomContext);
  const { state, sessionId } = roomCtx!.room!;

  const [isHover, setIsHover] = useState<boolean>(false);

  useEffect(() => {

  }, []);

  return (
    <div className='chat-container'>
      <div className='chat-messages'>
        <div className='chat-message-group'>
          <span className='chat-player'>Player_A :</span>
          <span className='chat-message'>Messaging</span>
        </div>
      </div>
      <form className='chat-input'>
        <input type='text' className='chat-text' placeholder='Type a Message' />
        <div
          className='chat-send'
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <RightArrow isHover={isHover} />
        </div>
      </form>
    </div>
  );
}

export default Chat;
