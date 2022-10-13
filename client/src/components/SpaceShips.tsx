import '@babylonjs/loaders';
import React, { useContext, useEffect } from 'react';
import { RoomContext } from '../contexts/roomContext';
import * as Colyseus from 'colyseus.js';
import { MainSpaceState, PlayerState } from '../../schemas';
import { useScene } from 'babylonjs-hook';
import {
  SceneLoader,
  AbstractMesh,
  Vector3,
  ActionManager,
  ExecuteCodeAction,
  ActionEvent,
  ArcRotateCamera,
  Scene
} from '@babylonjs/core';
import { DataChange } from '@colyseus/schema';

type SpaceCrafts = {
  [sessionId: string]: AbstractMesh[]
}

type KeyInput = {
  w: boolean,
  a: boolean,
  s: boolean,
  d: boolean,
}

type KeyInputs = {
  [sessionId: string]: KeyInput
}

function SpaceShips() {

  const scene = useScene();
  const roomCtx = useContext(RoomContext);
  const room = roomCtx!.room!;

  const getMesh = (sessionId: string) => {
    const { A, B, C } = room.state.labels;
    
    switch (sessionId) {
      case A:
        return 'spaceCraft1.obj';
      case B:
        return 'spaceCraft2.obj';
      case C:
        return 'spaceCraft3.obj';
    }
  }

  const sendKeyInputs = (scene: Scene, room: Colyseus.Room<MainSpaceState>) => {
    const inputMap: KeyInput = {
      w: false,
      a: false,
      s: false,
      d: false,
    };

    scene.actionManager = new ActionManager(scene);

    scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (e: ActionEvent) => {
      inputMap[e.sourceEvent.key as keyof KeyInput] = e.sourceEvent.type == 'keydown';
      room.send('key_input', inputMap);
    }));
    scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (e: ActionEvent) => {
      inputMap[e.sourceEvent.key as keyof KeyInput] = e.sourceEvent.type == 'keydown';
      room.send('key_input', inputMap);
    }));
  }

  useEffect(() => {
    if (scene) {
      const spaceCrafts = {} as SpaceCrafts;

      const keyInputs = {} as KeyInputs;

      room.state.players.forEach((player: PlayerState, sessionId: string) => {

        keyInputs[sessionId] = {
          w: false,
          a: false,
          s: false,
          d: false,
        }

        const mesh = getMesh(sessionId);

        SceneLoader.ImportMesh('', 'assets/models/', mesh, scene,
          (meshes: AbstractMesh[]) => {
            const { rotation, position: { x, y, z } } = player;
            spaceCrafts[sessionId] = meshes;

            meshes.forEach((mesh: AbstractMesh) => {
              mesh.position = new Vector3(x, y, z);
              mesh.scaling = new Vector3(0.2, 0.2, 0.2);

              const rotateAngle = rotation;
              const rotateRadian = rotateAngle * (Math.PI / 180);
              mesh.rotate(Vector3.Up(), rotateRadian);
            });
          });

        player.keyInput.onChange = (changes: DataChange<any>[]) => {
          changes.forEach((change: DataChange<any>) => {
            keyInputs[sessionId][change.field as keyof KeyInput] = change.value
          });
        }
      });

      sendKeyInputs(scene, room);

      // ----- display animations from server data ----- //

      let inputMap: KeyInputs = {} as KeyInputs;

      scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnEveryFrameTrigger, () => {
        inputMap = keyInputs;
      }));

      const rotateAngle = 1;
      const rotateRadian = rotateAngle * (Math.PI / 180);
      const camera = scene.getCameraByName('camera') as ArcRotateCamera;

      scene.registerBeforeRender(() => {
        for (const sessionId in spaceCrafts) {
          const currentPlayer = sessionId === room.sessionId;

          if (inputMap[sessionId]['w']) {
            spaceCrafts[sessionId].forEach((mesh: AbstractMesh) => {
              mesh.moveWithCollisions(mesh.forward.scaleInPlace(-0.2));
              if (currentPlayer) {
                camera.lockedTarget = mesh;
              }
            });
          } else if (inputMap[sessionId]['s']) {
            spaceCrafts[sessionId].forEach((mesh: AbstractMesh) => {
              mesh.moveWithCollisions(mesh.forward.scaleInPlace(0.2));
              if (currentPlayer) {
                camera.lockedTarget = mesh;
              }
            });
          }
          if (inputMap[sessionId]['a']) {
            spaceCrafts[sessionId].forEach((mesh: AbstractMesh) => {
              mesh.rotate(Vector3.Up(), -Math.abs(rotateRadian));
            });
            if (currentPlayer) {
              camera.alpha += rotateRadian;
            }
          } else if (inputMap[sessionId]['d']) {
            spaceCrafts[sessionId].forEach((mesh: AbstractMesh) => {
              mesh.rotate(Vector3.Up(), rotateRadian);
            });
            if (currentPlayer) {
              camera.alpha -= rotateRadian;
            }
          }
        }
      });

      return () => {
        // cleanup spaceCrafts
        for (const sessionId in spaceCrafts) {
          spaceCrafts[sessionId].forEach((mesh: AbstractMesh) => {
            mesh.dispose();
          });
        }
      }
    }
  }, [scene, room.state.players.size]);

  return null;
}

export default SpaceShips;
