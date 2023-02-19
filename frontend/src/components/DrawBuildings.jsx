import * as React from 'react';
import ReactDOMServer from 'react-dom/server';
import * as L from 'leaflet';
import { GeoJSON } from 'react-leaflet';
import axios from 'axios';

const API_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

export default function DrawBuildings({ geojson }) {
  const ref = React.useRef(null);
  const [buildingData, setBuildingData] = React.useState({});

  const getBuildingData = async (building, startTime, endRange, dayCondition) => {
    axios({
      method: 'get',
      url: `${API_ENDPOINT}/api/v1/classes/getClasses`,
      params: {
        building,
        startTime,
        endRange,
        dayCondition,
      },
    }).then((res) => {
      console.log('building Data fetched');
      setBuildingData((prevState) => {
        console.log('building data set:', { ...prevState, [building]: res });
        return { ...prevState, [building]: res };
      });
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
    console.log('classesList', classesList);
    let columns = ['displayName', 'title', 'description', 'locationDescription', 'startTime', 'endTime', 'course_id'];
    let columnDisplayNames = ['Course', 'Title', 'Description', 'Room', 'Start Time', 'End Time', 'Course ID'];
    return (
      <>
        <div>Classes in {buildingName}</div>
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
          getBuildingData(buildingName, '10:00:00', '11:00:00', 'meetsMonday');
          layer.togglePopup();
          console.log('data in layer', layerBuildingData);
        },
      });
    };
    return <GeoJSON {...props} onEachFeature={handleOnEachFeature} />;
  };

  return <GeoJSONWithBuildings data={geojson} buildingData={buildingData}></GeoJSONWithBuildings>;
}
