import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import * as L from 'leaflet';
import { GeoJSON } from 'react-leaflet';
import axios from 'axios';
import { Text } from '@chakra-ui/react';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export default function DrawBuildings({ geojson, day, startTime, hourRange }) {
  const ref = React.useRef(null);
  const [buildingData, setBuildingData] = React.useState({});

  const getBuildingData = async (building) => {
    const startDate = new Date(`2023-02-19T${startTime}Z`);

    // calculate end time
    const endDate = new Date(startDate.getTime() + hourRange * 60 * 60 * 1000);
    const endHours = endDate.getUTCHours().toString().padStart(2, '0');
    const endMinutes = endDate.getUTCMinutes().toString().padStart(2, '0');
    const endSeconds = endDate.getUTCSeconds().toString().padStart(2, '0');
    const endTime = `${endHours}:${endMinutes}:${endSeconds}`;
    console.log('Making request for', building, day, startTime, endTime);
    axios({
      method: 'get',
      url: `${API_ENDPOINT}/api/v1/classes/getClasses`,
      params: {
        building,
        startTime,
        endRange: endTime,
        dayCondition: day,
      },
    }).then((res) => {
      console.log(res);
      if (res.status === 200) {
        setBuildingData((prevState) => {
          return { ...prevState, [building]: res };
        });
      } else {
        console.error('Error %d, Could not make request to backend.', res.status);
      }
    });
  };

  React.useEffect(() => {
    if (ref.current?.getLayers().length === 0 && geojson) {
      L.geoJSON(geojson).eachLayer((layer) => {
        if (layer instanceof L.Polyline || layer instanceof L.Polygon || layer instanceof L.Marker) {
          ref.current?.addLayer(layer);
        }
      });
    }
  }, [geojson]);

  const PopupTable = (props) => {
    const buildingName = props.data;
    if (!buildingData[buildingName]) {
      return <div>Click building to load classes for {buildingName}</div>;
    }
    const classesList = buildingData[buildingName].data;
    if (classesList.length === 0) {
      return <div>No class data available for {buildingName} at this time</div>;
    }
    let columns = ['displayName', 'title', 'description', 'locationDescription', 'startTime', 'endTime', 'course_id'];
    let columnDisplayNames = ['Course', 'Title', 'Description', 'Room', 'Start Time', 'End Time', 'Course ID'];
    return (
      <>
        <Text fontSize="6xl">
          {buildingName} - {day.slice(5)}
        </Text>
        <table style={{ display: 'block', height: '300px', overflowY: 'scroll' }}>
          <thead>
            <tr>
              {columns.map((column, index) => {
                if (column === 'description') {
                  return (
                    <th key={index} style={{ width: '40%' }}>
                      {columnDisplayNames[index]}
                    </th>
                  );
                }
                return <th key={index}>{columnDisplayNames[index]}</th>;
              })}
            </tr>
          </thead>
          {classesList.map((clazz, i) => {
            let bgColor = '#ffffff';
            if (i % 2 === 0) {
              bgColor = '#f0f0f0';
            }
            return (
              <tr key={i} style={{ backgroundColor: bgColor }}>
                {columns.map((column, index) => {
                  return <td key={index}>{clazz[column]}</td>;
                })}
              </tr>
            );
          })}
        </table>
      </>
    );
  };

  const GeoJSONWithBuildings = (props) => {
    const layerBuildingData = props.buildingData;
    const handleOnEachFeature = (feature, layer) => {
      layer.on({
        mouseover: (e) => {
          const buildingName = e.target.feature.properties.buildingDescription;
          layer.bindPopup(buildingName, { maxWidth: Math.floor(window.innerWidth * 0.9) });
          layer.openPopup();
          layer.setPopupContent(ReactDOMServer.renderToString(<PopupTable data={buildingName} />));
        },
        mouseout: () => {
          layer.unbindPopup();
        },
        click: (e) => {
          const buildingName = e.target.feature.properties.buildingDescription;
          getBuildingData(buildingName);
          layer.togglePopup();
          console.log('data in layer', layerBuildingData);
        },
      });
    };
    return <GeoJSON {...props} onEachFeature={handleOnEachFeature} />;
  };

  return <GeoJSONWithBuildings data={geojson} buildingData={buildingData}></GeoJSONWithBuildings>;
}
