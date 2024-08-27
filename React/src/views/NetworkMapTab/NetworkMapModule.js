import * as d3 from "d3";
import React, { useEffect } from "react";
import { participants } from "../../constants/constants";
import { derived_socialNetwork } from "../../constants/constants";

import "./NetworkMapModule.css"

const line_space = 5; // offset for male and female individual entity (in pixels)
const c_r = 5;
const stroke_width = 2;
const margin = { top: 100, bottom: 70, right: 200, left: 200 }; // // Margin around the lollipop chart
const text_weight = 450;
var innerHeight;
var innerWidth;
const bubble_radius = 7;
const anti_collidef_buff = 1;
let xScale;
let radius_range = [1, 7];
const y_force_g = 77;
let out_of_focus_opacity = 0.2;
let full_opacity = 1;
let invisible_op = 0;
const participant_data = participants;
const derived_individual_connection = derived_socialNetwork;
const connections_data = d3.group(
    derived_individual_connection,
    (d) => d.participantIdFrom
);

const interest_group_color = [
    { group_i: "A", color: "#4e79a7" },
    { group_i: "B", color: "#f28e2c" },
    { group_i: "C", color: "#e15759" },
    { group_i: "D", color: "#76b7b2" },
    { group_i: "E", color: "#59a14f" },
    { group_i: "F", color: "#edc949" },
    { group_i: "G", color: "#af7aa1" },
    { group_i: "H", color: "#ff9da7" },
    { group_i: "I", color: "#9c755f" },
    { group_i: "J", color: "#bab0ab" },
];

var Tooltip = d3
.select("#tooltip_parent")
.append("div")
.style("opacity", 0)
.attr("class", "tooltip_hover");


function getXCoordinatesForParticipant(participant_i) {
    let val = participant_data.find((x) => x.participantId === participant_i);
    return val.x;
}

function getYCoordinatesForParticipant(participant_i) {
    let participanty = participant_data.find(function (participant_y) {
        return participant_i == participant_y.participantId;
    });
    return participanty.y;
}


function drawNetworkLines(selectedParticipant, changeOpacity) {

    // console.log(" type - ", type(selectedParticipant));
    selectedParticipant = +selectedParticipant;

    if (changeOpacity) {
        d3.selectAll(".particiapant_circle").style("opacity", out_of_focus_opacity);
    }

    // console.log(
    //   " drawing line for selected participant ",
    //   selectedParticipant, " do we have connection data",connections_data.has(selectedParticipant));
    const g_bubble = d3.select("#g_bubble");

    g_bubble.selectAll("#network_connected_lines").remove();
    g_bubble.select("#p" + selectedParticipant).attr("fill", "gray");

    if (connections_data != undefined && connections_data.has(selectedParticipant)) {
        let top_n_coonection = connections_data.get(selectedParticipant);

        let val = participant_data.find(
            (x) => x.participantId === selectedParticipant
        );
        let x_ref = val.x;

        let y_ref = getYCoordinatesForParticipant(
            selectedParticipant,
            participant_data
        );

        // g_bubble.remove()

        g_bubble
            .selectAll("myline")
            .data(top_n_coonection)
            .enter()
            .append("line")
            .attr("id", "network_connected_lines")
            .attr("x1", function (d) {
                return x_ref;
            })
            .attr("x2", function (d) {
                return getXCoordinatesForParticipant(
                    d.participantIdTo_y,
                    participant_data
                );
            })
            .attr("y1", function (d) {
                return y_ref;
            })
            .attr("y2", function (d) {
                return getYCoordinatesForParticipant(
                    d.participantIdTo_y,
                    participant_data
                );
            })
            .style("stroke-width", 1.5)
            .attr("stroke", "black");

        for (let i = 0; i < top_n_coonection.length; i++) {
            g_bubble
                .select("#p" + top_n_coonection[i].participantIdTo_y)
                //   .
                .style("stroke", "#ffff33")
                .attr("stroke-width", 1.5)
                .style("opacity", full_opacity);
            // .tran;
        }
    }
}


function changeSelectionText(pID) {
    d3.select("#g_bubble")
        .select("#ntw_selectedHeader")
        .text("Selected participant ID : " + pID);
}

const makeGraph = (props) => {

    var s_width = 800; //+svg.style('width').replace('px', '');
    var s_height = 550; // +svg.style('height').replace('px', '');


    // append g element to svg
    const svg = d3.select("#bubble_chart");

    svg.style("width", s_width).style("height", s_height);
    var svg_width = s_width - margin.left - margin.right;
    var svg_height = s_height - margin.top - margin.bottom;

    function getRandomArbitrary(min, max) {
        return Math.random() * (max - min) + min;
    }

    function getBubbleColor(entry) {
        let selected_intrestg = interest_group_color.find(
            (d) => d.group_i === entry["interestGroup"]
        );
        return selected_intrestg.color;
    }

    function ticked_timer() {
        bubbles
            .attr("cx", function (d) {
                return d.x;
            })
            .attr("cy", function (d) {
                return d.y;
            });
    }

    const bandvalue = [
        ...new Set(
            participant_data.map(function (d) {
                return d.interestGroup;
            })
        ),
    ].sort();

    // all simulation forces
    var f_body = d3
        .forceManyBody() // default = -30
        .strength(-10)
        .theta(1);

    var forceX = d3
        .forceX(function (d) {
            return xScale(d.interestGroup);
        })
        .strength(0.5);

    var forceY = d3
        .forceY()
        .y(function (d) {
            return getRandomArbitrary(-50, 50) + svg_height / 2;
        })
        .strength(0.5);

    var forceYCombine = d3
        .forceY(function (d) {
            let y_gap_force =
                (d.interestGroup.charCodeAt(0) - "A".charCodeAt(0)) * y_force_g;
            return y_gap_force;
        })
        .strength(0.05);

    // graph plotting

    // remove the prev_plot
    d3.select("#g_bubble").remove();

    // define a binding g element
    const g_bubble = svg
        .append("g")
        .attr("id", "g_bubble")
        .attr("class", "g_bubble")
        .attr("width", svg_width)
        .style("height", svg_height);

    // header text component
    g_bubble
        .append("text")
        .attr("id", "ntw_selectedHeader")
        .attr("x", svg_width / 2)
        // .attr("y", function (d, i) {
        //   return margin.top;
        // }) // 25 is the distance between two ledgend
        .text("No paritcipant selected")
        .attr("text-anchor", "center")
        .attr("font-weight", text_weight);

    // adding highlighted circle focus point
    g_bubble
        .append("circle")
        .attr("class", "dotted_circle")
        .style("stroke-dasharray", "10,3") // make the stroke dashed
        .style("stroke", "black") // set the line colour
        .style("stroke-width", 3)
        .style("fill", "none")
        .style("opacity", invisible_op);

    // scale
    xScale = d3
        .scaleBand()
        .domain(bandvalue)
        // .range([margin.top + 60, svg_height - 20])
        // .range([margin.top, svg_height])
        .range([margin.left, svg_width])
        .padding(0.1);

    // vote Scale
    var circle_r_Scale = d3
        .scaleSqrt()
        // .domain(d3.extent(derived_individual_connection, function(d) {  return d["uniqueConnection"]; }))
        .domain([0, 1])
        .range(radius_range);

    // add simulator
    var simulator = d3
        .forceSimulation()
        .force("x", forceX)
        .force("y", forceY)
        .force("body", f_body)
        .force(
            "anti_collide_force",
            d3.forceCollide(function (d) {
                return circle_r_Scale(d.joviality) + anti_collidef_buff;
            })
        );



    // add ticing timer to simulator
    simulator.nodes(participant_data).on("tick", ticked_timer);

    var bubbles = g_bubble
        .selectAll(".particiapant")
        .data(participant_data, (reg) => reg)
        .enter()
        .append("circle")
        .attr("class", "particiapant_circle")
        .attr("id", (d) => "p" + d.participantId)
        .attr("r", (d) => circle_r_Scale(d.joviality))
        .attr("fill", function (d) {
            return getBubbleColor(d);
        });
        // .on("mouseover", mouseover)
        // .on("mouseout", mouseout);

    bubbles
        .on("click", function (event, d) {
            if (d != undefined) {
                props.onChangeParticiapntId(d.participantId);
                // console.log("show single part view")

                // 
                changeSelectionText(d.participantId);

            }
        })
        .on("mouseover", function (event, d) {


            d3.selectAll(".particiapant_circle").style(
                "opacity",
                out_of_focus_opacity
            );

            const currentRadius = d3.select(this).attr("r");

            const newRadius = parseFloat(currentRadius) * 2;

            g_bubble
                .select(".dotted_circle")
                .attr("cx", d3.select(this).attr("cx")) // position the x-centre
                .attr("cy", d3.select(this).attr("cy")) // position the y-centre
                .attr("r", newRadius) // set the radius
                // set the fill colour
                .style("opacity", full_opacity);




            drawNetworkLines(d.participantId, false);
            d3.select(this)
                .attr("r", newRadius)
                .style("fill", "#ffff33")
                .style("opacity", full_opacity);

            let selectedParticipantCircle = d3.select(this).datum()
            let age = selectedParticipantCircle.age;
            let interestGroup = selectedParticipantCircle.interestGroup;
            let participantId = selectedParticipantCircle.participantId;
            let totalConnections = selectedParticipantCircle.n_unique;
            let joviality = selectedParticipantCircle.joviality
            let tooltipText = "Participant Id: <b>"+participantId+"</b><br>Age: <b>"+age+"</b><br>Interest Group: "+interestGroup+"</b><br>Joviality: <b>"+joviality+"</b><br>Total Connections: <b>"+totalConnections+"</b>";
            
            Tooltip.html(tooltipText) //Referred my own code from Homework 1
            .style("left", event.pageX + 15 + "px")
            .style("top", event.pageY + "px")
            .style("opacity", 1);


        })
        .on("mouseout", function (event, d) {
            //remove border
            props.onMouseOut();
            d3.selectAll(".particiapant_circle")
                .style("stroke", "white")
                .style("opacity", full_opacity);

            g_bubble.select(".dotted_circle").style("opacity", invisible_op);

            // remove all line connections
            g_bubble.selectAll("#network_connected_lines").remove();

            const currentRadius = d3.select(this).attr("r");
            const newRadius = parseFloat(currentRadius) / 2;
            d3.select(this)
                .attr("r", newRadius)
                .style("fill", (d) => getBubbleColor(d));

            Tooltip.html("").style("opacity", 0);
        });
};

function NetworkMapModule(props) {
    var participantID = props.participantID;
    useEffect(() => {
        makeGraph(props);
    }, []);

    drawNetworkLines(participantID, true);
    changeSelectionText(participantID);
    //  makeGraph(props);
    return (

        <div className="network plotdiv" >
                {/* <button id="combine_data">Combine </button> */}
            <svg id="bubble_chart"> </svg>
        </div>

    );
}

export default NetworkMapModule;