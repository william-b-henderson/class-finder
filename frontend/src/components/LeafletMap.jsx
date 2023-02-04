import React, { useState, useCallback, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polygon } from 'react-leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

import EditControlFC from './EditControls';

const ucCoordinates = [37.8719, -122.2591];
const zoom = 17;

const DisplayPosition = ({ map, mousePosition, geojson }) => {
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
  const [geojson, setGeojson] = useState({
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          buildingDescription: 'Dwinelle',
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [-122.260537, 37.871287],
              [-122.261267, 37.871113],
              [-122.261068, 37.870613],
              [-122.260795, 37.870698],
              [-122.260709, 37.870346],
              [-122.260779, 37.870287],
              [-122.260746, 37.870147],
              [-122.25999, 37.870257],
              [-122.260038, 37.870427],
              [-122.260264, 37.870406],
              [-122.260365, 37.87077],
              [-122.260151, 37.870829],
              [-122.260205, 37.870995],
              [-122.2605, 37.870931],
              [-122.260569, 37.87113],
              [-122.260484, 37.87116],
              [-122.260537, 37.871287],
            ],
          ],
        },
      },
    ],
  });

  return (
    <>
      {map ? <DisplayPosition map={map} mousePosition={mousePosition} geojson={geojson} /> : null}
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
        <EditControlFC geojson={geojson} setGeojson={setGeojson} />
      </MapContainer>
    </>
  );
};

export default LeafletMap;
