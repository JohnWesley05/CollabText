import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

const USER_COLORS = ['#A0CFEC', '#8FBC8F', '#F4A261', '#E76F51', '#2A9D8F'];
const USER_NAMES = [
  'Alice', 'Bob', 'Charlie', 'Dana', 'Eve', 'Frank', 'Grace', 'Heidi',
  'Ivan', 'Judy', 'Mallory', 'Oscar', 'Peggy', 'Trent', 'Walter'
];

export const randomUser = () => ({
  name: USER_NAMES[Math.floor(Math.random() * USER_NAMES.length)],
  color: USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)],
});

// Note: Using a public demo server. For production, you should host your own y-websocket server.
const WEBSOCKET_SERVER_URL = 'wss://demos.yjs.dev';

export function createWebsocketProvider(id: string, yjsDocMap: Map<string, Y.Doc>) {
  let doc = yjsDocMap.get(id);
  if (doc === undefined) {
    doc = new Y.Doc();
    yjsDocMap.set(id, doc);
  }

  // The 'y-websocket' package handles awareness updates automatically.
  // The provider will have an `awareness` property that the CollaborationPlugin can use.
  const provider = new WebsocketProvider(WEBSOCKET_SERVER_URL, id, doc);

  // The connect() and disconnect() methods are handled by the WebsocketProvider constructor
  // and its destroy() method, which Lexical's CollaborationPlugin will call on unmount.

  return provider;
}
