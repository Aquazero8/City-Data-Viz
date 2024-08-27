import React, { useRef, useEffect, useState } from "react";
import "./App.css";
import { select, selectAll, csv } from "d3";
import {
    apartments,
    buildings,
    employers,
    jobs,
    participants,
    pubs,
    restaurants,
    schools,
    
} from "./constants/constants";
import Tab1 from "./views/Tab1/Tab1";
import NetworkMapModule from "./views/NetworkMapTab/NetworkMapModule";
import financialData from "./constants/financial.json";
import InteractionsModal from "./Interactions";
import Business from "./views/BusinessTab/Business"

//import Views
import Chernoff from "./views/chernoffView";
import Demographics from "./views/demographicView";
import Financial from "./views/FinancialTab/Financial";
import SpendingTabModule from "./views/SpendingTab/SpendingTabModule";

function App() {
    const svgRef = useRef();
    const svg = select(svgRef.current);
    // console.log("this is svg", svg)
    const [chosenAttr, setChosenAttr] = useState("");
    const [chosenAttrValue, setChosenAttrValue] = useState();
    const [showModal, setShowModal] = useState(false);
    const [buttonText, setButtonText] = useState("Show Business Data");
    const [currentView, setCurrentView] = useState("demographics");
    const [participantID, setParticipantID] = useState("");
    const [redraw, setReDraw] = useState(false);
    const [isParticipantViewEnabled, setIsParticipantViewEnabled] = useState(false)

    const [selectedBaseMap, setSelectedBaseMap] = useState("Base Map 4");


    const handleBaseMapChange = (val) => {
      setSelectedBaseMap(val);
    };

    const toggleDisplays = () => {
        setButtonText(
            buttonText === "Show Business Data"
                ? "Show Demographic Data"
                : "Show Business Data"
        );
        setCurrentView(
            currentView === "demographics" ? "business" : "demographics"
        );
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const participantIDHandler = (participantID) => {
        setParticipantID(participantID);
        setIsParticipantViewEnabled(true);
        // console.log("single participant view enabled")
    };

    function attributeHandler(attr, attrValue) {
        setChosenAttr(attr);
        setChosenAttrValue(attrValue);
        setIsParticipantViewEnabled(false);
        // console.log("i was ran", attr, attrValue)
    }

    let commercialBuildings = {
        apartments: { ...apartments },
        restaurants: { ...restaurants },
        schools: { ...schools },
        pubs: { ...pubs },
        employers: { ...employers },
    };

    function updateParticipantId(){
      var participantIdEntered = +document.getElementById("participantId").value;
      if (participantIdEntered<0 || participantIdEntered>1010){
        participantIdEntered = 0;
        alert("Range is between 0 - 1010");
        document.getElementById("participantId").value = "0";
      }
      setParticipantID(participantIdEntered);
      setIsParticipantViewEnabled(true);
    }

    function resetAll(){
      attributeHandler("",3);
      setParticipantID("");
      document.getElementById("participantId").value = "";
    }

    return (
      <div className="container_main">
        <div className="nav_bar">
          <h1 className="">VAST 2022 Mini Challenge 1</h1>
          <button className="nav_bar_info_button" onClick={toggleModal}>
            i
          </button>
        </div>
        <div className="section-1">
          <div className="button_div_demographcs_business">
            <button className="toggle_button" onClick={() => toggleDisplays()}>
              <span>{buttonText}</span>
            </button>
            <label className={`participantID_input ${selectedBaseMap === "Base Map 4" || currentView === "business"  ? '' : 'disable_input'}`} >
              Participant ID:
              <input id="participantId" type="number" {...(selectedBaseMap === "Base Map 4" || currentView === "business"  ? {} : {disabled: true})} defaultValue={""} placeholder="Enter Participant ID" min={0} max={1010}/>
              <button className="submit" {...(selectedBaseMap === "Base Map 4" || currentView === "business"  ? {} : {disabled: true})} onClick={updateParticipantId}>Update</button>
              <button className="reset_button_all submit" {...(selectedBaseMap === "Base Map 4" || currentView === "business"  ? {} : {disabled: true})} onClick={resetAll}><i class="fas fa-undo"></i></button>
            </label>
          </div>
          <div className="demographics_first_row ">
            <div
              className="graph_cluster bar_graphs_population_overview dashboardLook"
              style={{
                display: currentView === "demographics" ? "flex" : "none",
              }}
            >
              <Demographics
                attributeHandler={attributeHandler}
                chosenAttr={chosenAttr}
                chosenAttrValue={chosenAttrValue}
                isParticipantViewEnabled={isParticipantViewEnabled}
                participantID={participantID}
              />
            </div>
            <div
              className="graph_cluster business_graph dashboardLook"
              style={{
                display: currentView === "business" ? "flex" : "none",
              }}
            >
              {currentView === "business" ? (
                <Business selectedParticpant={participantID}></Business>
              ) : (
                "Still In Demographic Mode."
              )}
            </div>
            <div className="map dashboardLook">
              {apartments.length && participants.length ? (
                <Tab1
                  commercialBuildings={commercialBuildings}
                  onChangeParticiapntId={participantIDHandler}
                  participantID={participantID}
                  currentView={currentView}
                  selectedRadioButton = {selectedBaseMap}
                  selectedBaseMapChangeHandler = {handleBaseMapChange}
                />
              ) : (
                <p>Loading Data...</p>
              )}
            </div>
            {/* <div className="">
                        <Chernoff
                            joviality={-1}
                            chosenAttr={chosenAttr}
                            chosenAttrValue={chosenAttrValue}
                        />
                    </div> */}
          </div>
        </div>
        <div className="section-2 dashboardLook" 
                      style={{
                        display: currentView === "business" ? "none" : "flex",
                      }}>
            <div className="network_graph ">
              <NetworkMapModule
                onChangeParticiapntId={participantIDHandler}
                participantID={participantID}
                onMouseOut={() => setIsParticipantViewEnabled(false)}
              />
            </div>
            <div className="spending_graph ">
                <SpendingTabModule onChangeParticiapntId={participantIDHandler} onMouseOut={() => setIsParticipantViewEnabled(false)}
              participantID={participantID}></SpendingTabModule>
            </div>
          {/* <div className="">
            <div className="chernoff">
                        {apartments.length && participants.length ? (
                            <Tab1 commercialBuildings={commercialBuildings} onChangeParticiapntId={participantIDHandler} participantID={participantID} />
                        ) : (
                            <p>Loading Data...</p>
                        )}
                    </div>
          </div> */}
        </div>
        {/* <div>
          <Business></Business>
        </div> */}

        {/* <div>
        <SpendingTabModule></SpendingTabModule>
        </div> */}
        {/* <div className="flex">
        <div className="financialDiv">
          <div className="participantFinancials border">
            <Financial
              financesData={financialData}
              participantId={participantID}
            />
          </div>
        </div>
      </div> */}
        {showModal && <InteractionsModal closeModal={toggleModal} />}
      </div>
      
    );
}

export default App;
