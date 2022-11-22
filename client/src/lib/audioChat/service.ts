import { AudioChat } from './index';
import Peer, { MediaConnection } from 'peerjs';

export class AudioChatService implements AudioChat {
  readonly myPeer: Peer;
  readonly peers = new Map<string, { call: MediaConnection, audio: HTMLAudioElement }>();

  myStream?: MediaStream;

  constructor(id: string) {
    this.myPeer = new Peer(id);

    this.initialize();
  }

  async initialize() {
    this.myStream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });

    this.myPeer.on('open', id => console.log(`Peerjs object instantiated with id:`, id));

    this.myPeer.on('call', call => {
      call.answer(this.myStream);

      call.on('stream', stream => {
        const audio = document.createElement('audio');
        this.addAudioStream(audio, stream);
        this.peers.set(call.peer, { call, audio });
        console.log('Received call from:', call.peer);
      });
    });
  }

  addPeer(id: string) {
    if (!this.myStream) return;

    const call = this.myPeer.call(id, this.myStream);

    call.on('stream', stream => {
      const audio = document.createElement('audio');
      this.addAudioStream(audio, stream);
      this.peers.set(id, { call, audio });
      console.log('Called', id);
    });
  }

  addAudioStream(audio: HTMLAudioElement, stream: MediaStream) {
    audio.srcObject = stream;
    audio.addEventListener('loadeddata', () => audio.play());
  }

  removePeer(id: string) {
    if (!this.peers.has(id)) return;

    const { call, audio } = this.peers.get(id)!;
    call.close();
    audio.remove();
    this.peers.delete(id);
    console.log('Removed', id);
  }
}
