import React, { useContext, useEffect, useState } from 'react';
import { RoomContext } from '../contexts/roomContext';
import { MobileContext } from '../contexts/mobileContext';
import { ChatState } from '../../schemas';
import { RightArrow } from '../utils/Svgs';
import useAudioChat from '../hooks/useAudioChat';

type Message = {
  label: string,
  name: string,
  message: string
}

function Chat() {

  const roomCtx = useContext(RoomContext);
  const { state, sessionId } = roomCtx!.room!;

  const mobileCtx = useContext(MobileContext)!;
  const { isMobilePortrait, isMobileLandscape } = mobileCtx;
  const isMobile = isMobilePortrait || isMobileLandscape;

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>('');
  const [labelColor, setLabelColor] = useState<string>('');
  const [isHover, setIsHover] = useState<boolean>(false);
  const [showChat, setShowChat] = useState<boolean>(!isMobile);

  const { peer, peers, stream, addPeer, removePeer } = useAudioChat(sessionId);

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

    const player = state.players.get(sessionId)!;
    const matchedColor = matchColor(player.label);
    setLabelColor(matchedColor);

    state.chats.onAdd = (chat: ChatState) => {
      const { label } = state.players.get(chat.id)!;
      const name = sessionId === chat.id ? 'You' : `Player_${label}`;
      setMessages((prev: Message[]) => (
        [...prev, { label, name, message: chat.message }]
      ));
    }
  }, []);

  useEffect(() => {
    if (!peer || !stream) return;

    const player = state.players.get(sessionId)!;

    player.callablePeers.forEach(peer => {
      addPeer(peer);
    });

    player.callablePeers.onAdd = peer => {
      addPeer(peer);
    }

    player.callablePeers.onRemove = peer => {
      removePeer(peer);
    }

  }, [peer, stream]);

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  }

  const submitHandler = (
    e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.preventDefault();
    roomCtx!.room!.send('send_msg', input);
    setInput('');
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

  const styles = {
    img: {
      display: showChat ? 'none' : 'block',
      bottom: isMobilePortrait ? '1.2rem' : '3rem'
    },
    chat: {
      display: showChat ? 'block' : 'none',
      width: isMobile ? 'calc(100% - 2rem)' : '35%',
      height: isMobile ? 'calc(100% - 2rem)' : '35%',
    },
    chatHeader: {
      display: isMobile ? 'block' : 'none',
      marginBottom: isMobile ? '1em' : '0',
    },
    chatMessages: {
      fontSize: isMobile ? '1.5rem' : '1rem',
      height: isMobile ? 'calc(100% - 8rem)' : 'calc(100% - 3rem)',
    },
    chatInput: {
      fontSize: isMobile ? '1.5rem' : '1rem',
      height: isMobile ? '4rem' : '3rem',
    }
  }

  return (
    <>
      {peers.size > 0 &&
        <img
          className='img-call'
          src='assets/images/call.svg'
          alt=''
        />
      }
      <img
        className='img-chat'
        src='assets/images/chat.svg'
        onClick={() => setShowChat(prev => !prev)}
        style={styles.img}
        alt=''
      />
      <div className='chat-container' style={styles.chat}>
        <div className='chat-header' style={styles.chatHeader}>
          <img
            className='img-x'
            src='assets/images/x.svg'
            onClick={() => setShowChat(prev => !prev)}
            alt=''
          />
        </div>
        <div className='chat-messages' style={styles.chatMessages}>
          {messagesArr}
        </div>
        <form
          className='chat-input'
          style={styles.chatInput}
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
    </>
  );
}

export default Chat;
