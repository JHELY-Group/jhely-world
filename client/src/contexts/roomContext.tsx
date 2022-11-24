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
  const [counter, setCounter] = useState<number>(0);

  useEffect(() => {
    (async () => {
      try {
        const client = new Colyseus.Client(process.env.REACT_APP_SERVER_API);
        const room = await client.joinOrCreate<MainSpaceState>('main_space');

        room.state.players.onAdd = () => {
          if (counter > 0) return;

          setRoom(room);
          setCounter(1);
        }
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
