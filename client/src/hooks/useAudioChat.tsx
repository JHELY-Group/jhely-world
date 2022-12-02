import { useEffect, useState } from 'react';
import Peer, { MediaConnection } from 'peerjs';

type Peers = Map<string, { call: MediaConnection, audio: HTMLAudioElement }>;

function useAudioChat(id: string) {

  const [peer, setPeer] = useState<Peer>();
  const [peers, setPeers] = useState<Peers>(new Map());
  const [stream, setStream] = useState<MediaStream>();
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      const processedId = processId(id);
      const peer = new Peer(processedId);
      setPeer(peer);

      const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
      setStream(stream);
    })();
  }, []);

  useEffect(() => {
    if (!peer || !stream) return;

    peer.on('call', call => {
      call.answer(stream);

      call.on('stream', stream => {
        const audio = document.createElement('audio');
        addAudioStream(audio, stream);
        peers.set(call.peer, { call, audio });
        console.log('peers:', peers);
        console.log('Received call from:', call.peer);
      });

      call.on('close', () => {
        console.log('removing peer...')
        removePeer(call.peer);
      });
    });
    setIsInitialized(true);

  }, [peer, stream]);

  const addPeer = (id: string) => {
    if (!peer || !stream) return;

    const processedId = processId(id);
    const call = peer.call(processedId, stream);

    call.on('stream', stream => {
      const audio = document.createElement('audio');
      addAudioStream(audio, stream);
      peers.set(processedId, { call, audio });
      console.log('peers:', peers);
      console.log('Called', processedId);
    });
  }

  const removePeer = (id: string) => {
    if (!peers.has(id)) return;

    const processedId = processId(id);
    const { call, audio } = peers.get(processedId)!;
    call.close();
    audio.remove();
    peers.delete(processedId);
    console.log('peers:', peers);
    console.log('Removed', processedId);
  }

  const addAudioStream = (audio: HTMLAudioElement, stream: MediaStream) => {
    audio.srcObject = stream;
    audio.addEventListener('loadeddata', () => audio.play());
  }

  const processId = (id: string) => {
    return id.replaceAll(/[^0-9a-z]/gi, 'G');
  }

  return { isInitialized, addPeer, removePeer };
}

export default useAudioChat;
