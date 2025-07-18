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

// Update the URL to point to the local backend server.
// Note: This uses 'ws' instead of 'wss' for local, unencrypted connection.
const WEBSOCKET_SERVER_URL = process.env.NODE_ENV === 'production' 
    ? 'wss://your-production-websocket-url' // Replace with your deployed backend URL
    : 'ws://localhost:8080';

export function createWebsocketProvider(
    id: string, 
    yjsDocMap: Map<string, Y.Doc>,
    user: { name: string; color: string }
) {
  let doc = yjsDocMap.get(id);
  if (doc === undefined) {
    doc = new Y.Doc();
    yjsDocMap.set(id, doc);
  }

  const provider = new WebsocketProvider(WEBSOCKET_SERVER_URL, id, doc, {
    params: {},
  });

  // Set the user's awareness state (name and cursor color)
  provider.awareness.setLocalStateField('user', {
    name: user.name,
    color: user.color,
  });

  return provider;
}
