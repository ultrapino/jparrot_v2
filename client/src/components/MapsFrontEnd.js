import React, { useState, useEffect } from "react";
import Button from 'react-bootstrap/Button';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import { Card } from "react-bootstrap";
import Tweet from "./Tweet";
import axios from "axios";
import "./MapsFrontEnd.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapsFrontEnd() {
  var marker = {};
  const [range, setRange] = useState(1);
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [showRange, setShowRange] = useState(false);
  const [showTweets, setShowTweets] = useState(false);
  const [showError, setShowError] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");

  const searchTweets = async () => {
    try {
      const result = await axios.get("http://localhost:8000/map/geo-keyword", {
        params: {
          range,
          position,
          keyword,
        },
      });
      console.log(result);
      if (result.data.data != undefined) {
        setTweets(() => {
          return result.data.data;
        });
        setUsers(() => {
          return result.data.includes.users;
        });
        setShowError(false);
        setShowTweets(true);
      } else {
        setShowTweets(false);
        setShowError(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  
  const updatePosition = (lat, lng) => {
    setPosition(() => {
      return { lat: lat, lng: lng };
    });
  };
  return (
    <div className='container'>
      <br/>
      <Row className="mx-auto">
    <Col>
    <Card id="cardinput" border="light" className="mx-auto" style={{ width: '50vw' }}>
    <Card.Header>Scegli una posizione sulla mappa</Card.Header>
    <Card.Body>
      <Card.Title>   
           
        {showRange && (
        <div className='input'>
          <Form.Label>Scegli un'area</Form.Label>
          <Form.Range onChange={e => setRange(e.target.value)} className="slider" value={range} min='1' max='40000'/>
          <p>Metri: {range} </p>
          <br/>
          <Row className="mb-3">
            <Form.Group as={Col} md="6" controlId="validationFormik03">
            <FormControl
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
            aria-label="Username"
              aria-describedby="basic-addon1" placeholder="Inserisci una parola chiave  "
          />
            </Form.Group>
            <Form.Group as={Col} md="6" controlId="validationFormik03">
            <Button onClick={searchTweets} variant="outline-primary">Cerca</Button>{' '}
            </Form.Group>
            </Row>
        </div>
      )}</Card.Title>
      <Card.Text>
      </Card.Text>
    </Card.Body>
  </Card>
    </Col>
  </Row>
      
  <br />
      <Row className="mx-auto">
      <MapContainer
        className="mapcontainer mx-auto"
        style={{ height: "50vmin", width: "110vmin",}}
        center={[44.494887, 11.3426163]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <Mycomponent
          position={position}
          updatePosition={updatePosition}
          range={range}
          setShowRange={setShowRange}
        />
      </MapContainer>
      </Row>
      <Row className="mx-auto">
      {showTweets && (
        <div className='tweet-list mx-auto'>
          {tweets.map((tweet) => {
            const user = users.filter((user) => user.id == tweet.author_id);
            return <Tweet key={tweet.id} user={user[0]} tweet={tweet} />;
          })}
        </div>
      )}

      </Row>

      {showError && <div className='errormsg'>No Tweets Found :C</div>}
    </div>
  );
}

function Mycomponent({ position, updatePosition, range, setShowRange }) {
  const [clicked, setClicked] = useState(false);
  const map = useMapEvents({
    click(e) {
      updatePosition(e.latlng.lat, e.latlng.lng);
      setClicked(true);
      setShowRange(true);
    },
  });
  return (
    <>
      {clicked && (
        <>
          <Circle
            center={position}
            pathOptions={{ color: "blue", stroke: false }}
            radius={range}
          />
          <Marker position={position}></Marker>
        </>
      )}
    </>
  );
}

export default MapsFrontEnd;
