import React, { ReactNode, useContext } from 'react';
import * as Colyseus from 'colyseus.js';
import { RoomContext } from '../contexts/roomContext';
import { MobileProvider } from '../contexts/mobileContext';
import SceneComponent from './SceneComponent';
import Backdrop from './Backdrop';
import Chat from './Chat';

function App() {

  const roomCtx = useContext(RoomContext)!;

  return (
    <MobileProvider>
      <div className='main-container'>
        {roomCtx.room ?
          <>
            <SceneComponent />
            <Chat />
          </>
          :
          <Backdrop />
        }
      </div>
    </MobileProvider>
  );
}

export default App;
