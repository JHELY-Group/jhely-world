import { createContext } from 'react';
import * as Colyseus from 'colyseus.js';
import { MainSpaceState } from '../../schemas';

export interface RoomContextInterface {
  room: Colyseus.Room<MainSpaceState> | null
}

export const RoomContext = createContext<RoomContextInterface | null>(null);
