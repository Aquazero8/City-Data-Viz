import { React, useEffect, useState } from "react";
import "./BaseMap.css";
import * as d3 from "d3";

function BaseMap(props) {
  var projection = props.projection;
  var geojsonData = props.geoJsonData;
  var heatMapData;

  useEffect(() => {
    var Tooltip = d3
      .select("#tooltip_parent")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip_hover");

    var _svgBaseMap = d3.select("#" + props.whichMap);
    const width = props.svgDimensions.width;
    const height = props.svgDimensions.height;
    const margin = props.svgDimensions.margin;
    const innerwidth = props.svgDimensions.innerwidth;
    const innerHeight = props.svgDimensions.innerHeight;

    const scaleFactor = 0.1; // You can adjust this value to scale down the map
    projection.scale(scaleFactor);

    const path = d3.geoPath().projection(projection);

    const mapFeatures = geojsonData.features;

    const zoomMap = (event) => {
      let { k, x, y } = event.transform;
      let transform = { k: k, x: x + margin.left, y: y + margin.top };
      g.attr("transform", () => {
        return (
          "translate(" +
          transform.x +
          "," +
          transform.y +
          ") scale(" +
          transform.k +
          ")"
        );
      });
      g.attr("stroke-width", 1 / transform.k);
    };

    const reset = () => {
      mapPaths.transition().style("fill", null);
      _svgBaseMap
        .transition()
        .duration(650)
        .call(
          zoom.transform,
          d3.zoomIdentity,
          d3.zoomTransform(_svgBaseMap.node()).invert([width / 2, height / 2])
        );
    };

    function clickPath(event, d) {
      const [[x0, y0], [x1, y1]] = pathLine.bounds(d);
      event.stopPropagation();
      mapPaths.transition().style("fill", null);
      d3.select(this).transition().style("fill", "green");
      _svgBaseMap
        .transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(
              Math.min(4, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
            )
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
          d3.pointer(event, _svgBaseMap.node())
        );
    }

    let zoom = d3.zoom().scaleExtent([1, 7]).on("zoom", zoomMap);

    const svgViewBox = _svgBaseMap
      .attr("viewBox", [0, 0, width, height])
      .on("click", reset);

    const g = _svgBaseMap
      .append("g")
      .attr("id", "map-details")
      .attr(
        "transform",
        "translate(" + margin.left + "," + -(margin.top + 30) + ")"
      );

    let mapPaths;
    if (
      props.whichMap !== "svg__baseMap__Occupancy" &&
      props.whichMap !== "svg__baseMap__heatmap"
    ) {
      mapPaths = g
        .append("g")
        .attr("class", "geoPath")
        .selectAll("path")
        .data(geojsonData.features)
        .join("path")
        .attr("d", d3.geoPath().projection(projection))
        .attr("fill", (d, i) => {
          if (d.properties.buildingType === "Commercial") return "#E7B099";
          else if (d.properties.buildingType === "Residential")
            return "#DBE5D5";
          else if (d.properties.buildingType === "School") return "#711D8C";
          else return "#ffee65";
        })
        .attr("stroke", (d, i) => {
          return "black";
        })
        .attr("stroke-width", "0.4")
        .on("click", clickPath);

      //legends
      const legendData = [
        { label: "Commercial", color: "#E7B099" },
        { label: "Residential", color: "#DBE5D5" },
        { label: "School", color: "#711D8C" },
      ];

      const legendWidth = 100;
      const legendHeight = 80;
      const legendX = 10;
      const legendY = 50;

      const legend = g
        .append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${legendX}, ${legendY})`);

      const legendItems = legend
        .selectAll(".legend-item")
        .data(legendData)
        .join("g")
        .attr("class", "legend-item").attr("class", "legend-text-class")
        .attr("transform", (d, i) => `translate(0, ${i * 20})`);

      legendItems
        .append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .attr("fill", (d) => d.color);

      legendItems
        .append("text")
        .attr("x", 20)
        .attr("y", 12)
        .text((d) => d.label);
      if (props.whichMap === "svg__baseMap") {
        const circleLegendData = [
          { label: "Apartment", color: "#5A5A5A", radius: 2 },
          { label: "Pubs", color: "#2f9fc4ce", radius: 6 },
          { label: "School", color: "#FEE440CC", radius: 6 },
          { label: "Restaurant", color: "#61399199", radius: 6 },
          { label: "Employer", color: "#ff9a02", radius: 3 },
        ];

        const circleLegendX = 15;
        const circleLegendY = 120;

        const circleLegend = g
          .append("g")
          .attr("class", "circle-legend")
          .attr("transform", `translate(${circleLegendX}, ${circleLegendY})`);

        const circleLegendItems = circleLegend
          .selectAll(".circle-legend-item")
          .data(circleLegendData)
          .join("g")
          .attr("class", "circle-legend-item").attr("class", "legend-text-class")
          .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        circleLegendItems
          .append("circle")
          .attr("r", (d) => d.radius)
          .attr("fill", (d) => d.color);

        circleLegendItems
          .append("text")
          .attr("x", 20)
          .attr("y", 5)
          .text((d) => d.label);
      }
      if (props.whichMap === "svg__baseMap__participantMovement") {
        const colorForMovement = {
          "At Home": "blue",
          "Transport": "red",
          "At Restaurant": "purple",
          "At Work": "orange",
          "At Recreation": "green",
        };

        const legendData = Object.entries(colorForMovement).map(
          ([label, color]) => ({ label, color })
        );

        const legendRadius = 7;
        const legendX = 10;
        const legendY = 150;

        const legend = g
          .append("g")
          .attr("class", "legend")
          .attr("transform", `translate(${legendX}, ${legendY})`);

        const legendItems = legend
          .selectAll(".legend-item")
          .data(legendData)
          .join("g")
          .attr("class", "legend-item").attr("class", "legend-text-class")
          .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legendItems
          .append("circle")
          .attr("r", legendRadius)
          .attr("cx", legendRadius)
          .attr("cy", legendRadius)
          .attr("fill", (d) => d.color);

        legendItems
          .append("text")
          .attr("x", legendRadius * 3)
          .attr("y", legendRadius * 1.5)
          .text((d) => d.label);
      }
      if (props.whichMap === "svg__baseMap__Rental") {
        const colorScale = d3
          .scaleBand()
          .range(["#FBAB3D", "#B73C02"])
          .domain(["low", "high"]);

        const legendWidth = 200;
        const legendHeight = 20;

        const legend = g
          .append("g")
          .attr("class", "legend")
          .attr("transform", `translate(10, 115)`);

        const defs = legend.append("defs");
        const linearGradient = defs
          .append("linearGradient")
          .attr("id", "color-gradient")
          .attr("x1", "0%")
          .attr("y1", "0%")
          .attr("x2", "100%")
          .attr("y2", "0%");

        linearGradient
          .append("stop")
          .attr("offset", "0%")
          .attr("stop-color", "#FBAB3D");

        linearGradient
          .append("stop")
          .attr("offset", "100%")
          .attr("stop-color", "#B73C02");

        legend
          .append("rect")
          .attr("width", legendWidth)
          .attr("height", legendHeight)
          .style("fill", "url(#color-gradient)");

        legend
          .append("text")
          .attr("class", "legend-text").attr("class", "legend-text-class")
          .attr("x", 0)
          .attr("y", legendHeight + 15)
          .style("text-anchor", "start")
          .text("Low");

        legend
          .append("text")
          .attr("class", "legend-text").attr("class", "legend-text-class")
          .attr("x", legendWidth)
          .attr("y", legendHeight + 15)
          .style("text-anchor", "end")
          .text("High");
      }
    } else if (props.whichMap === "svg__baseMap__Occupancy") {
      const MINROOMS = 1;
      const MAXROOMS = 29;
      const NUMCOLORS = 5;
      const OCCUPANCYBINSIZE = Math.ceil((MAXROOMS - MINROOMS) / NUMCOLORS);

      const COLORSCALE = d3
        .scaleSequential()
        .interpolator(d3.interpolateBlues)
        .domain([0, NUMCOLORS]);

      const BLUECOLORS = d3.range(NUMCOLORS).map((d) => COLORSCALE(d + 1));

      mapPaths = g
        .append("g")
        .attr("class", "geoPath")
        .selectAll("path")
        .data(geojsonData.features)
        .join("path")
        .attr("d", d3.geoPath().projection(projection))
        .attr("id", (d) => {
          return d.properties.buildingId;
        })
        .attr("fill", (d, i) => {
          if (d.properties.buildingType === "Residential") {
            if (!d.properties.maxOccupancy) {
              return BLUECOLORS[NUMCOLORS - 1];
            }
            return BLUECOLORS[
              Math.floor(
                (Math.ceil(d.properties.maxOccupancy) - MINROOMS) /
                  OCCUPANCYBINSIZE
              )
            ];
          } else return "#ffffff";
        })
        .attr("stroke", (d, i) => {
          return "#000000";
        })
        .attr("stroke-width", "0.4")
        .on("click", clickPath);

      const legend = g
        .append("g")
        .attr("class", "legend").attr("class", "legend-text-class")
        .attr("transform", "translate(20, 60)");

      legend
        .append("defs")
        .append("linearGradient")
        .attr("id", "gradient")
        .selectAll("stop")
        .data(COLORSCALE.range())
        .enter()
        .append("stop")
        .attr("offset", (d, i) => i / (COLORSCALE.range().length - 1))
        .attr("stop-color", (d) => d);

      legend
        .append("rect")
        .attr("width", 200)
        .attr("height", 20)
        .style("fill", "url(#gradient)");

      legend
        .append("text")
        .attr("x", 10)
        .attr("y", 35)
        .attr("text-anchor", "end")
        .text("Sparse");

      legend.append("text").attr("x", 180).attr("y", 35).text("Dense");
    } else if (props.whichMap === "svg__baseMap__heatmap") {
      heatMapData = props.checkinData;

      mapPaths = g
        .append("g")
        .attr("class", "geoPath")
        .selectAll("path")
        .data(geojsonData.features)
        .join("path")
        .attr("class","heat_map_path")
        .attr("d", d3.geoPath().projection(projection))
        .attr("id", (d) => {
          return "building_" + d.properties.buildingId;
        })
        .attr("fill", (d, i) => {
          let buildingId = heatMapData[d.properties.buildingId];
          if (buildingId) {
            // console.log(d)
            let countBuildings = buildingId.count / 400 / 10;
            if (countBuildings > 1) countBuildings = 1;
            return d3.interpolateOrRd(countBuildings);
          } else {
            return d3.interpolateOrRd(0.09);
          }
        })
        .attr("stroke", (d, i) => {
          return "black";
        })
        .attr("stroke-width", "0.4")
        .on("click", clickPath);

      const colorScale = d3
        .scaleSequential()
        .interpolator(d3.interpolateOrRd)
        .domain([0, 1]);

      const legendWidth = 200;
      const legendHeight = 20;

      const defs = g.append("defs");
      const linearGradient = defs
        .append("linearGradient")
        .attr("id", "linear-gradient")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

      const numStops = 10;
      const stopColors = d3
        .range(numStops)
        .map((d) => colorScale(d / (numStops - 1)));
      linearGradient
        .selectAll("stop")
        .data(stopColors)
        .join("stop")
        .attr("offset", (d, i) => `${(i / (numStops - 1)) * 100}%`)
        .attr("stop-color", (d) => d);

      g.append("rect")
        .attr("x", 10).attr("class", "legend-text-class")
        .attr("y", legendHeight + 50)
        .attr("width", legendWidth)
        .attr("height", legendHeight)
        .style("fill", "url(#linear-gradient)");

      const legendScale = d3
        .scaleLinear()
        .range([0, legendWidth])
        .domain(colorScale.domain());
      // const legendAxis = d3
      //   .axisBottom(legendScale)
      //   .ticks(2)
      //   .tickFormat(d3.format(".2f"));
      const legendAxis = d3.axisBottom(legendScale)
    .tickValues([0, 0.5, 1])
    .tickFormat(d => {
        if (d === 0) {
            return "Low";
        } else if (d === 0.5) {
            return "Medium";
        } else {
            return "High";
        }
    });

      g.append("g")
        .attr("transform", `translate(10, ${legendHeight+70})`)
        .attr("class","legend-text-class")
        .call(legendAxis);
    }
    var pathLine = d3.geoPath().projection(projection);
    _svgBaseMap.call(zoom);

    //MouseEvents
    function mouseover(event) {
      var tooltipText = "";
      var selectedBuilding = d3.select(this).datum().properties;
      if (selectedBuilding.buildingType) {
        tooltipText =
          "Type of Building: <b>" + selectedBuilding.buildingType + "</b><br>";
      }
      if (selectedBuilding.buildingId) {
        tooltipText +=
          "Location ID: <b>" + selectedBuilding.buildingId + "</b><br>";
      }
      if (selectedBuilding.buildingType === "Residential") {
        if (selectedBuilding.maxOccupancy === undefined) {
          selectedBuilding.maxOccupancy = "Not Given";
        }
        tooltipText +=
          "Max Occupancy: <b>" + selectedBuilding.maxOccupancy + "</b><br>";
      }

      if (props.whichMap === "svg__baseMap__heatmap") {
        if (heatMapData[selectedBuilding.buildingId]) {
          let footFall = heatMapData[selectedBuilding.buildingId];
          tooltipText += "Total Footfall: <b>" + footFall.count + "</b><br>";
        }
      }

      Tooltip.html(tooltipText) //Referred my own code from Homework 1
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY + "px")
        .style("opacity", 1);
    }

    function mouseout(event) {
      Tooltip.html("").style("opacity", 0);
    }
    mapPaths.on("mouseover", mouseover);
    mapPaths.on("mouseout", mouseout);
  }, []);

  return (
    <>
      {/* <h1>Base Map</h1>
            <div className="div__baseMap">
                <svg id="svg__baseMap" className="©"></svg>
            </div> */}
    </>
  );
}

export default BaseMap;
