
/*
 * Dependencies
 */
const express = require('express');


/*
 * Config
 */
const app = express();
const port = process.env.PORT || 3000;
app.use(express.static(`${__dirname}/public`));


/*
 * User Routes
 */

// app.get('/', (req, res) => {    // Direct traffic to splash screen first
//   res.redirect('/welcome');
// });

// app.get('*', (req, res) => {
//   res.redirect('/welcome');
// });



/*
 * socket.io
 */


const http = require("http");
const server = http.createServer(app);
server.listen(port);


// Setup sockets with the HTTP server
const socketio = require('socket.io');
const { match } = require('assert');
let io = socketio.listen(server);
console.log(`Listening for socket connections on port ${port}`);

let buttonCount = 0;



// Register a callback function to run when we have an individual connection
// This is run for each individual client that connects
io.sockets.on('connection',
  // Callback function to call whenever a socket connection is made
  function (socket) {

    // Print message to the console indicating that a new client has connected
    console.log("New client: " + socket.id);
    socket.broadcast.emit('event', "hello");     // Send new lenth to everyone
    // io.to(socket.id).emit('numClients', clientList.length); 
    // io.to(socket.id).emit('mode', mode);                        // Send current mode to new client


    socket.on('event',
    function(data) {
       console.log(data);
      }
    );

    socket.on('test',
    function(data) {
       console.log(data);
      }
    );

    socket.on('button',
    function(data) {
        if(data == 1) {
          buttonCount++;
        }
       console.log('button: ' + data);
       //socket.broadcast.emit('button', data);
      }
    );

    setInterval( function() {
        sendBuzz(socket);
    }, 1000);

    function sendBuzz(socket) {
      if(buttonCount > 0) {
        socket.broadcast.emit('buzz', '1');
        console.log('sent buzz: 1');
      } else { 
        socket.broadcast.emit('buzz', '0');
        console.log('sent Buzz: 0');
      }
      buttonCount = 0;
    }

    // setInterval( function() {
    //     sendHello(socket);
    //     console.log('sent Hello');
    // }, 10000);

    // function sendHello(socket) {
    //     socket.broadcast.emit('event', "hello");
    // }
        
    
    // Specify a callback function to run when the client disconnects
    socket.on('disconnect',
      function() {
        console.log("Client has disconnected: " + socket.id);
      }
    );
  }
);

