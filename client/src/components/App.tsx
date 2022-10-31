import React, { useEffect, useState } from 'react';
import * as Colyseus from 'colyseus.js';
import { MainSpaceState } from '../../schemas';
import { RoomContext } from '../contexts/roomContext';
import SceneComponent from './SceneComponent';
import Backdrop from './Backdrop';
import config from '../utils/url.json';

function App() {

  const [room, setRoom] = useState<Colyseus.Room<MainSpaceState> | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const client = new Colyseus.Client(process.env.REACT_APP_SERVER_API);
        const room = await client.joinOrCreate<MainSpaceState>('main_space', { name: 'player' });
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
      {room ?
        <SceneComponent />
        :
        <Backdrop />
      }
    </RoomContext.Provider>
  );
}

export default App;
