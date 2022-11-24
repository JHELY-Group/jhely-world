import React, { ReactNode, useContext } from 'react';
import * as Colyseus from 'colyseus.js';
import { RoomContext } from '../contexts/roomContext';
import { MobileProvider } from '../contexts/mobileContext';
import SceneComponent from './SceneComponent';
import Backdrop from './Backdrop';
import Chat from './Chat';

function App() {

  const roomCtx = useContext(RoomContext)!;

  if (!roomCtx.room) return <Backdrop />;

  if (!roomCtx.room.state.players.size) return <Backdrop />;

  return (
    <MobileProvider>
      <div className='main-container'>
        <SceneComponent />
        <Chat />
      </div>
    </MobileProvider>
  );
}

export default App;
