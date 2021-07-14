const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const citybikeurl = "http://api.citybik.es/v2/networks/decobike-miami-beach"



const port = process.env.PORT || 4001;
const index = require("./routes/index");
const app = express();


app.use(index);

const server = http.createServer(app);
const io = socketIo(server); // < Interesting!
let interval;

io.on("connection", socket => {
  var socketId = socket.id;
  var clientIp = socket.request.connection.remoteAddress;
  console.log('New connection ' + socketId + ' from ' + clientIp);
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getAndEmitData(socket), 3000); // refresh every 3 seconds
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

const getAndEmitData = async (socket) => {
  try {
    const res = await axios.get(citybikeurl);
    const { stations } = res.data.network;
    socket.emit('bikes-socket', stations);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
};

server.listen(port, () => console.log(`Server listening on port: ${port}`));
