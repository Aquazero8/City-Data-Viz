import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import data from "../../constants/businesscount.json"
import "./Business.css"
import venue_buildingMap from "../../constants/venuId_businessId_map.json"
import participantVenue from "../../constants/participant_venue.json"


function makeBusinessGraph(color,particiantId) {
  var Tooltip = d3
  .select("#tooltip_parent").append("div")
  .style("opacity", 0)
  .attr("class", "tooltip_hover") 

  const group = d3
    .select("#business_chart");

//   console.log(group)

  const width = +group.style('width').replace('px', '');
  const height = +group.style('height').replace('px', '');
  const margin = { top: 20, bottom: 50, right: 50, left: 60 };
  const innerwidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const hierarchy = d3
    .hierarchy(data)
    .sum((d) => d.count)
    .sort((a, b) => b.count - a.count);

  const pack = d3.pack().size([innerHeight/2, innerwidth/2]).padding(3);

  const rootNode = pack(hierarchy);

  
  const g = group.append("g")

  // console.log(group)

  
  // console.log("1",innerHeight)
  // console.log("2",innerwidth)

  // console.log(width, height)

  g.attr("transform", "translate(" + (innerwidth/2 - margin.left) + "," + (innerHeight/6) + ")");

    function mouseover(event){
      var tooltipText = ""
      var selectedBuilding = d3.select(this).datum()
      let venueType = selectedBuilding.data.venueType;
      let footfall = selectedBuilding.data.count;
      let venue_id = selectedBuilding.data.venueId;

      tooltipText = "Venue Type:<b>"+venueType+"</b><br>FootFall: <b>"+footfall+"</b><br>Venue Id: <b>"+venue_id+"</b>"
      if (!selectedBuilding.children){
        Tooltip
        .html(tooltipText) //Referred my own code from Homework 1
        .style("left", (event.pageX+15) + "px")
        .style("top", (event.pageY) + "px")
        .style("opacity",1)
      }
    }

    function mouseout(){
      Tooltip
      .html("")
      .style("opacity",0)
    }

    function mouseClick(event){
      var selectedBuilding = d3.select(this).datum();
      let buildingId = venue_buildingMap[selectedBuilding.data.venueId].buildingID;
      console.log(d3.select("#building_"+buildingId))
      let allHeatMap = d3.selectAll(".heat_map_path")
      .attr("opacity", "0.1")
      let map_selectedArea = d3.select("#building_"+buildingId);

      map_selectedArea
      .attr("opacity", "1")
      .style("fill","green");

      allHeatMap
      .transition()
      .delay(1500)
      .attr("opacity", "1")
      map_selectedArea
      .transition()
      .delay(1500)
      .style("fill",null);
      
    }

  const circles = g
    .selectAll("circle")
    .data(rootNode.descendants())
    .join("circle")
    // .attr("transform", "translate(" + (margin.left) + "," + (margin.top) + ")")
    .attr("r", (d) => d.r*1.3)
    .attr("class", (d) => {
      if (!d.children) return "child_circle";
      else return "parent_circle";
    })
    .attr("id",(d,i)=>{
      return "circle_"+d.data.venueId
    })
    .attr("cx", (d) => d.x*1.3)
    .attr("cy", (d) => d.y*1.3)
    .style("fill", (d) => {
      if (!d.children) {
        if (d.parent) {
          let venueType = d.parent.data.name;
          if (venueType === "Pub") return color(0);
          else if (venueType === "Restaurant") return color(1);
          else if (venueType === "Workplace") return color(3);
        }
      } else return "none";
    })
    .style("stroke", (d) => {
      if (!d.children) {
        if (d.parent) {
          let venueType = d.parent.data.name;
          if (venueType === "Pub") return color(0);
          else if (venueType === "Restaurant") return color(1);
          else if (venueType === "Workplace") return color(3);
        }
      } else return "black";
    })
    .style("opacity", 1)
    .style("stroke-width", 2)
    .on("mouseover", function (d) {
      d3.selectAll(".child_circle").style("opacity", 0.2);

      d3.select(this).style("opacity", 1);
    })
    .on("mouseout", function (d) {
      d3.selectAll(".child_circle").style("opacity", 1);

      d3.select(this).style("opacity", 1);
    })
    .on("mouseover",mouseover)
    .on("click",mouseClick)
    .on("mouseout",mouseout);

    if(particiantId!==""){
      let participant_visited_buildings = participantVenue[particiantId]
      d3.selectAll(".child_circle").style("opacity", 0.07);
      for (let i=0;i<participant_visited_buildings.length;i++){
        d3.select("#circle_"+participant_visited_buildings[i])
        .style("opacity", 1);
      }
    }
  // circles
  //   .transition()
  //   .duration(3000)
  //   .delay((d, i) => i * 5)
  //   .attr("r", (d) => d.r)
  //   .style("opacity", 1);

  const legend = group
    .selectAll(".legend")
    .data(color.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr("transform", function (d, i) {
      const legendX = 65;
      const legendY = i*40 + 220;
      return "translate(" + legendX + "," + legendY + ")";
    });

  legend
    .append("circle")
    .attr("cx", 30)
    .attr("cy", 10)
    .attr("r",15)
    .style("fill", color);

  legend
    .append("text")
    .data(rootNode.data.children)
    .attr("x", 65)
    .attr("y", 10)
    .attr("dy", ".35em")
    .style("text-anchor", "start")
    .text(function (d) {
      return d.name;
      
    });
}

function Business(props) {
  var particiantId = props.selectedParticpant;
  useEffect(() => {
    var color = d3.scaleOrdinal(d3.schemeTableau10);
    makeBusinessGraph(color,particiantId);
  }, [particiantId]);
  return (
    <>
      <svg id="business_chart"></svg>
    </>
  );
}

export default Business;
