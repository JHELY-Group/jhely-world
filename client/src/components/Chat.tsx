import React, { useContext, useEffect } from 'react';
import { RoomContext } from '../contexts/roomContext';

function Chat() {

  const roomCtx = useContext(RoomContext);
  const { state, sessionId } = roomCtx!.room!;

  useEffect(() => {
  }, []);

  return (
    <div className="chat-wrapper">
    </div>
  );
}

export default Chat;

