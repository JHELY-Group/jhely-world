import '@babylonjs/loaders';
import React, { useContext, useEffect } from 'react';
import { RoomContext } from '../contexts/roomContext';
import { DataChange } from '@colyseus/schema';
import { PlayerState } from '../../schemas';
import { useScene } from 'babylonjs-hook';
import {
  SceneLoader,
  AbstractMesh,
  Vector3,
  ArcRotateCamera
} from '@babylonjs/core';

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

  const loadSpaceShip = (
    player: PlayerState,
    sessionId: string,
    keyInputs: KeyInputs,
    spaceCrafts: SpaceCrafts
  ) => {
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
        keyInputs[sessionId][change.field as keyof KeyInput] = change.value;
      });
    }
  }

  const clearSpaceShip = (
    sessionId: string,
    keyInputs: KeyInputs,
    spaceCrafts: SpaceCrafts
  ) => {
    spaceCrafts![sessionId].forEach((mesh: AbstractMesh) => {
      mesh.dispose();
    });
    delete keyInputs[sessionId];
    delete spaceCrafts[sessionId];
  }

  useEffect(() => {
    if (scene) {
      const spaceCrafts = {} as SpaceCrafts;

      const keyInputs = {} as KeyInputs;

      room.state.players.forEach((player: PlayerState, sessionId: string) => {
        loadSpaceShip(player, sessionId, keyInputs, spaceCrafts);
      });

      room.state.players.onAdd = (player: PlayerState, sessionId: string) => {
        loadSpaceShip(player, sessionId, keyInputs, spaceCrafts);
      }

      room.state.players.onRemove = (p: PlayerState, sessionId: string) => {
        clearSpaceShip(sessionId, keyInputs, spaceCrafts);
      }

      const rotateAngle = 1;
      const rotateRadian = rotateAngle * (Math.PI / 180);
      const camera = scene.getCameraByName('camera') as ArcRotateCamera;

      scene.registerBeforeRender(() => {
        if (!Object.keys(keyInputs).length) return;

        for (const sessionId in spaceCrafts) {
          const inputMap = keyInputs[sessionId];
          const currentPlayer = sessionId === room.sessionId;

          if (inputMap['w']) {
            spaceCrafts[sessionId].forEach((mesh: AbstractMesh) => {
              mesh.moveWithCollisions(mesh.forward.scaleInPlace(-0.2));
              if (currentPlayer) {
                camera.lockedTarget = mesh;
              }
            });
          } else if (inputMap['s']) {
            spaceCrafts[sessionId].forEach((mesh: AbstractMesh) => {
              mesh.moveWithCollisions(mesh.forward.scaleInPlace(0.2));
              if (currentPlayer) {
                camera.lockedTarget = mesh;
              }
            });
          }
          if (inputMap['a']) {
            spaceCrafts[sessionId].forEach((mesh: AbstractMesh) => {
              mesh.rotate(Vector3.Up(), -Math.abs(rotateRadian));
            });
            if (currentPlayer) {
              camera.alpha += rotateRadian;
            }
          } else if (inputMap['d']) {
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
  }, [scene]);

  return null;
}

export default SpaceShips;
