import { ChakraProvider } from '@chakra-ui/react';
import { MapContainer, TileLayer, useMap, Marker, Popup } from 'react-leaflet';
import './App.css';
import LeafletMap from './components/LeafletMap';

function App() {
  return (
    <ChakraProvider>
      <LeafletMap></LeafletMap>
    </ChakraProvider>
  );
}

export default App;
