const {
  production
} = require('y-websocket/bin/utils');
const ywebsocket = require('y-websocket/bin/server');

const port = process.env.PORT || 8080;

// Set up a new y-websocket server
ywebsocket.YWebSocketServer({
  port
});

console.log(`y-websocket server running on port ${port}`);

// This is a workaround to ensure the server process doesn't exit immediately
// in some environments. It keeps the event loop alive.
if (production) {
  setInterval(() => {}, 1000)
}
