import React, { useContext, useEffect, useState } from 'react';
import { RoomContext } from '../contexts/roomContext';
import { Channel, DefaultGenerics, StreamChat } from 'stream-chat';
import '../chat.css';
import {
  Chat as ChatContainer,
  Channel as ChannelContainer,
  MessageInput,
  MessageList,
  Thread,
  Window
} from 'stream-chat-react';

function Chat() {

  const roomCtx = useContext(RoomContext);
  const { state, sessionId } = roomCtx!.room!;

  const [client, setClient] = useState<StreamChat<DefaultGenerics>>();
  const [channel, setChannel] = useState<Channel<DefaultGenerics>>();

  const { id } = state.players.get(sessionId)!;
  const user = {
    id,
    name: `player_${id}`,
    image: `assets/images/player_${id}.png`
  }

  useEffect(() => {
    (async () => {
      const client = StreamChat.getInstance('azsx7wv8sqyz');
      await client.connectUser(user, client.devToken(user.id));

      const channel = client.channel('messaging', 'chat');
      await channel.addMembers([user.id]);
      await channel.watch();

      setClient(client);
      setChannel(channel);
    })();
  }, []);

  return (
    <div className="chat-wrapper">
      {client &&
        <ChatContainer client={client} theme='str-chat__theme-dark'>
          <ChannelContainer channel={channel}>
            <Window>
              <MessageList />
              <MessageInput />
            </Window>
            <Thread />
          </ChannelContainer>
        </ChatContainer>
      }
    </div>
  );
}

export default Chat;

