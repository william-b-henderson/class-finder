import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer } from 'react-leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios';

import DrawBuildings from './DrawBuildings';
import { MenuBar } from './MenuBar';

const ucCoordinates = [37.8719, -122.2591];
const zoom = 17;
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const LeafletMap = () => {
  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  L.Marker.prototype.options.icon = DefaultIcon;

  const [map, setMap] = useState(null);
  const [geojson, setGeojson] = useState(null);

  const [startTime, setStartTime] = useState('08:00:00');
  const [day, setDay] = useState('meetsMonday');
  const [hourRange, setHourRange] = useState(1);

  useEffect(() => {
    let ignore = false;
    async function fetchGeoJSON() {
      axios({
        method: 'get',
        url: `${API_ENDPOINT}/api/v1/buildings/getBuildingGeoJSON`,
      }).then((res) => {
        if (!ignore) {
          console.log('geoJSON loaded');
          setGeojson(res.data);
        }
      });
    }
    fetchGeoJSON();
    return () => {
      ignore = true;
    };
  }, []);

  return (
    <>
      <MenuBar setStartTime={setStartTime} setDay={setDay} />
      <MapContainer style={{ height: '90vh', width: '100vw' }} center={ucCoordinates} zoom={zoom} ref={setMap}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geojson && (
          <DrawBuildings key={geojson} geojson={geojson} day={day} startTime={startTime} hourRange={hourRange} />
        )}
      </MapContainer>
    </>
  );
};

export default LeafletMap;
