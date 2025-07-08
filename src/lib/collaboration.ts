import * as Y from 'yjs';
import { Awareness, applyAwarenessUpdate, encodeAwarenessUpdate } from 'y-protocols/awareness';
import { Observable } from 'lib0/observable';

const USER_COLORS = ['#A0CFEC', '#8FBC8F', '#F4A261', '#E76F51', '#2A9D8F'];
const USER_NAMES = [
  'Alice', 'Bob', 'Charlie', 'Dana', 'Eve', 'Frank', 'Grace', 'Heidi',
  'Ivan', 'Judy', 'Mallory', 'Oscar', 'Peggy', 'Trent', 'Walter'
];

export const randomUser = () => ({
  name: USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)],
  color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)],
});

const bcReady = { current: false };
const bcConnected = { current: false };

class BroadcastChannelProvider extends Observable<any> {
  public awareness: Awareness;
  private bc: BroadcastChannel;
  private doc: Y.Doc;

  // Store handlers to be able to remove them on disconnect
  private readonly _docUpdateHandler: (update: Uint8Array, origin: any) => void;
  private readonly _awarenessUpdateHandler: (changes: { added: number[], updated: number[], removed: number[] }, origin: any) => void;
  private readonly _bcMessageHandler: (event: MessageEvent) => void;


  constructor(roomName: string, doc: Y.Doc) {
    super();
    this.doc = doc;
    this.awareness = new Awareness(doc);
    this.bc = new BroadcastChannel(roomName);

    this._docUpdateHandler = (update: Uint8Array, origin: any) => {
      // Don't broadcast updates that came from this provider
      if (origin !== this) {
        this.bc.postMessage({ type: 'update', update });
      }
    };
    this.doc.on('update', this._docUpdateHandler);

    this._awarenessUpdateHandler = ({ added, updated, removed }, origin) => {
       // Don't broadcast awareness updates that came from this provider
      if (origin !== this) {
        const changedClients = added.concat(updated, removed);
        const states = this.awareness.getStates();
        const changedStates = new Map();
        for (const clientID of changedClients) {
          const state = states.get(clientID);
          if (state) {
            changedStates.set(clientID, state);
          }
        }
        if (changedStates.size > 0) {
          this.bc.postMessage({
              type: 'awareness',
              awareness: encodeAwarenessUpdate(this.awareness, changedClients),
          });
        }
      }
    };
    this.awareness.on('update', this._awarenessUpdateHandler);

    this._bcMessageHandler = (event) => {
      const { type, update, awareness } = event.data;
      if (type === 'update' && update) {
        Y.applyUpdate(this.doc, new Uint8Array(update), this);
      } else if (type === 'awareness' && awareness) {
        applyAwarenessUpdate(this.awareness, new Uint8Array(awareness), this);
      }
    };
    this.bc.addEventListener('message', this._bcMessageHandler);
  }

  public connect() {
    // For this mock, connect is synchronous
    bcConnected.current = true;
    this.emit('status', [{ status: 'connected' }]);
  }

  public disconnect() {
    this.doc.off('update', this._docUpdateHandler);
    this.awareness.off('update', this._awarenessUpdateHandler);
    this.bc.removeEventListener('message', this._bcMessageHandler);
    
    bcConnected.current = false;
    this.emit('status', [{ status: 'disconnected' }]);
    this.bc.close();
  }
}

export function createWebsocketProvider(id: string, yjsDocMap: Map<string, Y.Doc>) {
  let doc = yjsDocMap.get(id);
  if (doc === undefined) {
    doc = new Y.Doc();
    yjsDocMap.set(id, doc);
  }
  return new BroadcastChannelProvider(id, doc);
}
