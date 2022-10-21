import React, { useEffect, useState } from 'react';
import * as Colyseus from 'colyseus.js';
import { MainSpaceState } from '../../schemas';
import { RoomContext } from '../contexts/roomContext';
import SceneComponent from './SceneComponent';
import Backdrop from './Backdrop';
import config from '../utils/url.json';
import Chat from './Chat';

function App() {

  const [room, setRoom] = useState<Colyseus.Room<MainSpaceState> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(config.ENV_URL);
        const SERVER_URL = await res.json();
        const client = new Colyseus.Client(SERVER_URL);

        const room = await client.joinOrCreate<MainSpaceState>('main_space');
        room.onStateChange(() => {
          // clone room instance to cause re-render
          const roomClone = Object.create(
            Object.getPrototypeOf(room),
            Object.getOwnPropertyDescriptors(room)
          );
          setRoom(roomClone)
        });
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <RoomContext.Provider value={{ room }}>
      <div className='main-container'>
        {room ?
          <>
            <SceneComponent />
            <Chat />
          </>
          :
          <Backdrop />
        }
      </div>
    </RoomContext.Provider>
  );
}

export default App;
