import React, { useState, useCallback, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import axios from 'axios';

import DrawBuildings from './DrawBuildings';

const ucCoordinates = [37.8719, -122.2591];
const zoom = 17;
const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

const DisplayPosition = ({ map, mousePosition, geojson, setBuildingName, buildingName }) => {
  const [position, setPosition] = useState(() => map.getCenter());

  const onClick = useCallback(() => {
    map.setView(ucCoordinates, zoom);
  }, [map]);

  const handleSave = useCallback(() => {
    const element = document.createElement('a');
    const textFile = new Blob([JSON.stringify(geojson)], { type: 'text/plain' });
    element.href = URL.createObjectURL(textFile);
    element.download = 'geojson.json';
    document.body.appendChild(element);
    element.click();
    console.log(geojson);
  }, [geojson]);

  const onMove = useCallback(() => {
    setPosition(map.getCenter());
  }, [map]);

  useEffect(() => {
    map.on('move', onMove);
    return () => {
      map.off('move', onMove);
    };
  }, [map, onMove]);

  return (
    <p>
      latitude: {mousePosition[0]}, longitude: {mousePosition[1]} <button onClick={onClick}>reset</button>{' '}
      <button onClick={handleSave}>Save geoJSON</button>
      <input
        onChange={(e) => {
          setBuildingName(e.target.value);
          console.log(buildingName);
        }}
      ></input>
    </p>
  );
};

const MapEvents = ({ setMousePosition, editablePolygon }) => {
  useMapEvents({
    click(e) {
      // setState your coords here
      // coords exist in "e.latlng.lat" and "e.latlng.lng"
      setMousePosition([e.latlng.lat.toFixed(4), e.latlng.lng.toFixed(4)]);
    },
  });
  return false;
};

const LeafletMap = () => {
  let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  L.Marker.prototype.options.icon = DefaultIcon;

  const [map, setMap] = useState(null);
  const [mousePosition, setMousePosition] = useState([0, 0]);
  const [polygon, setPolygon] = useState(null);
  const [buildingName, setBuildingName] = useState('');
  const [geojson, setGeojson] = useState(null);

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
      {map && geojson ? (
        <DisplayPosition
          key={geojson}
          map={map}
          mousePosition={mousePosition}
          geojson={geojson}
          setBuildingName={setBuildingName}
          buildingName={buildingName}
        />
      ) : null}
      <MapContainer style={{ height: '90vh', width: '100vw' }} center={ucCoordinates} zoom={zoom} ref={setMap}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapEvents setMousePosition={setMousePosition} editablePolygon={polygon} />
        <Marker position={ucCoordinates}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
        {geojson && <DrawBuildings key={geojson} geojson={geojson} />}
        {/* <EditControlFC key={geojson} geojson={geojson} setGeojson={setGeojson} buildingName={buildingName} /> */}
      </MapContainer>
    </>
  );
};

export default LeafletMap;
