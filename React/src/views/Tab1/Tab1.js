import React, { useEffect, useState } from "react";
import BaseMap from "./BaseMap";
import "./Tab1.css";
import buildingsTopoJson from "../../constants/buildings.json";
import * as topojson from "topojson";
import * as d3 from "d3";
import Plot from "./Plot";
import RentalCostPlot from "./RentalCostPlot";
import ParticipantMovement from "./ParticipantMovement";
// import HeatMap from "./HeatMap";
import checkinData from "../../constants/checkinJournal.json";

function Tab1(props) {
  var participantID = props.participantID;
  var currentView = props.currentView;
  var selectedBaseMap = props.selectedRadioButton;

  const [participantData, setParticipantData] = useState();
  const [timeoutID, setTimeoutID] = useState([]);
  const [inputParticipantId, setInputParticipantId] = useState(0);
  const [isInputChanged, setIsInputChanged] = useState(false);
  // const [selectedBaseMap, setSelectedBaseMap] = useState("Base Map 4");

  const handleBaseMapChange = (event) => {
    props.selectedBaseMapChangeHandler(event.target.value);
  };

  let commercialBuildings = props.commercialBuildings;

  const width = 780; //+_svgBaseMap.style('width').replace('px', '');
  const height = 900; //+_svgBaseMap.style('height').replace('px', '');
  const margin = { top: -10, bottom: 50, right: 50, left: 60 };
  const innerwidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const svgDimensions = {
    width: width,
    height: height,
    margin: margin,
    innerwidth: innerwidth,
    innerHeight: innerHeight,
  };

  const geojsonData = topojson.feature(
    buildingsTopoJson,
    buildingsTopoJson.objects.buildings
  );
  const projection = d3
    .geoIdentity()
    .fitSize([innerwidth, innerHeight], geojsonData);

  useEffect(() => {
    for (let i = 0; i < timeoutID.length; i++) clearTimeout(timeoutID[i]);

    setTimeoutID([]);
    d3.select(".circle_movement").remove();
    d3.select(".participant_timestamp").remove();

    (async () => {
      try {
        const module = await import(
          `../../constants/pmoveData/pm${participantID}.csv`
        );
        const response = await fetch(module.default);
        const data = await response.text();
        const parsedData = d3.csvParse(data);
        setParticipantData(parsedData);
      } catch (error) {
        console.error(
          `Failed to load CSV file. No such file exists - demo${participantID}.csv`
        );
      }
    })();
    
  }, [participantID]);

  const timeoutIDHandler = (timeoutarray) => {
    setTimeoutID(timeoutarray);
  };

  // const inputParticipantChangeHandler = (event) => {
  //   if (event.target.value > 1010 || event.target.value < 0)
  //     setInputParticipantId(0);
  //   else setInputParticipantId(event.target.value);

  //   setIsInputChanged(true);
  //   console.log(inputParticipantId);
  // };

  // const participantUDHandler = (event) => {
  //   for (let i = 0; i < timeoutID.length; i++) clearTimeout(timeoutID[i]);

  //   setTimeoutID([]);
  //   d3.select(".circle_movement").remove();
  //   d3.select(".participant_timestamp").remove();

  //   props.onChangeParticiapntId(inputParticipantId);
  //   setIsInputChanged(false);
  // };

  return (
    <>
      <div className="base-map-selector glass"
      style={{ display: currentView === "demographics" ? "flex" : "none" }}> 
      <div className="radio-inputs_1">
        <label>
              <input
                type="radio"
                name="baseMap"
                value="Base Map 1"
                checked={selectedBaseMap === "Base Map 1"}
                onChange={handleBaseMapChange}
              />{" "}
              Building Type
            </label>
            <label>
              <input
                type="radio"
                name="baseMap"
                value="Base Map 2"
                checked={selectedBaseMap === "Base Map 2"}
                onChange={handleBaseMapChange}
              />{" "}
              Rental Cost Across City
            </label>
      </div>
    <div className="radio-inputs_2">
    <label>
          <input
            type="radio"
            name="baseMap"
            value="Base Map 3"
            checked={selectedBaseMap === "Base Map 3"}
            onChange={handleBaseMapChange}
          />{" "}
          Occupancy Capacity
        </label>
        <label>
          <input
            type="radio"
            name="baseMap"
            value="Base Map 4"
            checked={selectedBaseMap === "Base Map 4"}
            onChange={handleBaseMapChange}
          />{" "}
          Participant Movement
        </label>
    </div>
        <label style={{display: "none"}}>
          <input
            type="radio"
            name="baseMap"
            value="Base Map 5"
            checked={selectedBaseMap === "Base Map 5"}
            onChange={handleBaseMapChange}
          />{" "}
          Heat Map - Hot Business's 
        </label>
      </div>
      <div
        className="map_container"
        style={{ display: selectedBaseMap === "Base Map 1" && currentView === "demographics" ? "block" : "none" }}
      >
        <div className="div__baseMap">
          <svg id="svg__baseMap" className="svg__baseMap">
            <BaseMap
              whichMap={"svg__baseMap"}
              commercialBuildings={commercialBuildings}
              projection={projection}
              geoJsonData={geojsonData}
              svgDimensions={svgDimensions}
            />
            <Plot
              id={"apartment"}
              data={props.commercialBuildings.apartments}
              projection={projection}
              svgDimensions={svgDimensions}
            />
            <Plot
              id={"pubs"}
              data={props.commercialBuildings.pubs}
              projection={projection}
              svgDimensions={svgDimensions}
            />
            <Plot
              id={"school"}
              data={props.commercialBuildings.schools}
              projection={projection}
              svgDimensions={svgDimensions}
            />
            <Plot
              id={"restaurant"}
              data={props.commercialBuildings.restaurants}
              projection={projection}
              svgDimensions={svgDimensions}
            />
            <Plot
              id={"employer"}
              data={props.commercialBuildings.employers}
              projection={projection}
              svgDimensions={svgDimensions}
            />
          </svg>
        </div>
      </div>
      <div className="map_container"
        style={{ display: selectedBaseMap === "Base Map 2" && currentView === "demographics"? "block" : "none" }}
      >
        <div className="div__baseMap">
          <svg id="svg__baseMap__Rental" className="svg__baseMap__Rental">
            <BaseMap
              whichMap={"svg__baseMap__Rental"}
              commercialBuildings={commercialBuildings}
              projection={projection}
              geoJsonData={geojsonData}
              svgDimensions={svgDimensions}
            />
            <RentalCostPlot
              id={"apartment"}
              data={props.commercialBuildings.apartments}
              projection={projection}
              svgDimensions={svgDimensions}
            />
          </svg>
        </div>
      </div>
      <div
        className="map_container"
        style={{ display: selectedBaseMap === "Base Map 3" && currentView === "demographics"? "block" : "none" }}
      >
        <div className="div__baseMap">
          <svg id="svg__baseMap__Occupancy" className="svg__baseMap__Occupancy">
            <BaseMap
              whichMap={"svg__baseMap__Occupancy"}
              commercialBuildings={commercialBuildings}
              projection={projection}
              geoJsonData={geojsonData}
              svgDimensions={svgDimensions}
            />
          </svg>
        </div>
      </div>
      <div
        className="map_container"
        style={{ display: selectedBaseMap === "Base Map 4" && currentView === "demographics"? "block" : "none" }}
      >
        <h1>Participant Movement - {participantID}</h1>
        <div className="div__baseMap">
          <svg
            id="svg__baseMap__participantMovement"
            className="svg__baseMap__participantMovement"
          >
            <BaseMap
              whichMap={"svg__baseMap__participantMovement"}
              commercialBuildings={commercialBuildings}
              projection={projection}
              geoJsonData={geojsonData}
              svgDimensions={svgDimensions}
            />
            {participantData ? (
              <ParticipantMovement
                projection={projection}
                svgDimensions={svgDimensions}
                participantData={participantData}
                onChangeTimeout={timeoutIDHandler}
              />
            ) : (
              "Loading Participant Data..."
            )}
          </svg>
          {/* <input
            type="number"
            id="participantId"
            placeholder="Enter Participant Id"
            className="participantID"
            min={0}
            max={1010}
            value={inputParticipantId}
            onChange={inputParticipantChangeHandler}
          />
          {isInputChanged && (
            <button onClick={participantUDHandler}>Submit</button>
          )} */}
        </div>
      </div>
      <div
        className="map_container heatMap"
        style={{ display: currentView === "demographics" ? "none" : "block" }}
      >
        <h1>Heat Map - Prominent Business Places</h1>
        <div className="div__baseMap">
          <svg id="svg__baseMap__heatmap" className="svg__baseMap__heatmap">
            <BaseMap
              whichMap={"svg__baseMap__heatmap"}
              commercialBuildings={commercialBuildings}
              projection={projection}
              geoJsonData={geojsonData}
              svgDimensions={svgDimensions}
              checkinData={checkinData}
            />
            {/* {checkinData ? 
              <HeatMap
              projection={projection}
              svgDimensions={svgDimensions}
              checkinData={checkinData}
            /> : "Loading Heat Map..."} */}
          </svg>
        </div>
      </div>
    </>
  );
}

export default Tab1;
