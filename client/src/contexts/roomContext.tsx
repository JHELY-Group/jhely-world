import { useState, useEffect, createContext, ReactNode } from 'react';
import * as Colyseus from 'colyseus.js';
import { MainSpaceState } from '../../schemas';

export interface RoomContextInterface {
  room: Colyseus.Room<MainSpaceState> | undefined,
}

export const RoomContext = createContext<RoomContextInterface | null>(null);

type RoomProviderProps = {
  children: ReactNode
}

export const RoomProvider = ({ children }: RoomProviderProps) => {

  const [room, setRoom] = useState<Colyseus.Room<MainSpaceState>>();

  useEffect(() => {
    (async () => {
      try {
        const client = new Colyseus.Client(process.env.REACT_APP_SERVER_API);
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
      {children}
    </RoomContext.Provider>
  );
}
