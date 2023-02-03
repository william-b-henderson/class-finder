import React, { useState, useCallback, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, Polygon } from 'react-leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const ucCoordinates = [37.8719, -122.2591];
const zoom = 17;

const DisplayPosition = ({ map, mousePosition }) => {
  const [position, setPosition] = useState(() => map.getCenter());

  const onClick = useCallback(() => {
    map.setView(ucCoordinates, zoom);
  }, [map]);

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
      latitude: {mousePosition[0]}, longitude: {mousePosition[1]} <button onClick={onClick}>reset</button>
    </p>
  );
};

const MapEvents = ({ setMousePosition, editablePolygon }) => {
  useMapEvents({
    click(e) {
      // setState your coords here
      // coords exist in "e.latlng.lat" and "e.latlng.lng"
      setMousePosition([e.latlng.lat.toFixed(4), e.latlng.lng.toFixed(4)]);
      editablePolygon._latlngs = [...editablePolygon._latlngs, [e.latlng.lat.toFixed(4), e.latlng.lng.toFixed(4)]];
      console.log(e.latlng.lat);
      console.log(e.latlng.lng);
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

  console.log(polygon);

  return (
    <>
      {map ? <DisplayPosition map={map} mousePosition={mousePosition} /> : null}
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
        <Polygon
          positions={[
            [37.871074, -122.261277],
            [37.87126132, -122.2605371475],
            [37.87024027, -122.259979248],
            [37.870158922, -122.2608804702],
          ]}
          ref={setPolygon}
        />
      </MapContainer>
    </>
  );
};

export default LeafletMap;
