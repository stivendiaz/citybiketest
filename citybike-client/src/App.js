import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

export const icon = new Icon({
  iconUrl: '/assets/bike.png',
  iconSize: [60, 60],
});

class App extends Component {
  constructor() {
    super();

    this.state = {
      response: false,
      endpoint: "http://127.0.0.1:4001",
      lat: 25.7760782,
      lng: -80.194204,
      zoom: 15
    };

  }
  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on('bikes-socket', data => {
      this.setState({ stations: data });
    });
  }
  render() {
    const { stations } = this.state;
    const position = [this.state.lat, this.state.lng]
    return (

      <div className="map">
        <h1> City Bikes in Miami </h1>
        <Map center={position} zoom={this.state.zoom}>
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {stations && stations.map( station => (
            <Marker position={[station.latitude, station.longitude]} icon={icon} key={station.id} >
              <Popup>
                <h2>{station.name} Station</h2>
                <p style={{ fontSize: 15 }}>Address: {station.extra.address}</p>
                <p style={{ fontSize: 15 }}>Free bikes: {station.free_bikes}</p>
              </Popup>
            </Marker>
          ))}
        </Map>
      </div>
    );
  }
}
export default App;
