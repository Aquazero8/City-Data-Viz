import * as d3 from "d3";
import { useEffect } from "react";
import "./ParticipantMovement.css";

function ParticipantMovement(props) {
  var data = props.participantData;
  var projection = props.projection;

  useEffect(() => {
    var _svgBaseMap = d3.select("#svg__baseMap__participantMovement");
    var timeoutIDArray = [];

    const width = props.svgDimensions.width;
    const height = props.svgDimensions.height;
    const margin = props.svgDimensions.margin;
    const innerwidth = props.svgDimensions.innerwidth;
    const innerHeight = props.svgDimensions.innerHeight;
    const colorForMovement = {
      AtHome: "blue",
      Transport: "red",
      AtRestaurant: "purple",
      AtWork: "orange",
      AtRecreation: "green",
    };

    const g = _svgBaseMap.select("#map-details");
    const g_ = g.append("g").attr("id", "g__participantMovement");

    data = data.splice(0, data.length - 1);

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

    let zoom = d3.zoom().scaleExtent([1, 5]).on("zoom", zoomMap);

    const getProjectedCoord = (xPoint, yPoint) => {
      let projectionCoord = [xPoint, yPoint];
      let xPointProjected = projection(projectionCoord)[0];
      let yPointProjected = projection(projectionCoord)[1];
      return [xPointProjected, yPointProjected];
    };
    const apartmentCircle = g_.selectAll("circle");

    apartmentCircle
      .data([data[0]])
      .enter()
      .append("circle")
      .attr("class", "circle_movement")
      .attr("fill", "black")
      .attr("r", "7")
      .attr("stroke", "black")
      .attr("fill", (d) => {
        return colorForMovement[d.purpose];
      })
      .attr("cx", (d) => {
        return getProjectedCoord(d.startingXCoord, d.startingYCoord)[0];
      })
      .attr("cy", (d) => {
        return getProjectedCoord(d.startingXCoord, d.startingYCoord)[1];
      });

    g_.selectAll("text")
      .data([data[0]])
      .enter()
      .append("text")
      .attr("class", "participant_timestamp")
      .text((d) => {
        return d.timestamp;
      })
      .attr("x", (d) => {
        return innerwidth/2;
      })
      .attr("y", (d) => {
        return innerHeight;
      });

    let updatedData = data.slice(0);

    for (let i = 0; i < updatedData.length; i++) {
      let timeoutID = setTimeout(() => {
        let newX = getProjectedCoord(
          updatedData[i].startingXCoord,
          updatedData[i].startingYCoord
        )[0];
        let newY = getProjectedCoord(
          updatedData[i].startingXCoord,
          updatedData[i].startingYCoord
        )[1];
        d3.select(".circle_movement")
          .attr("cx", newX)
          .attr("cy", newY)
          .attr("fill", colorForMovement[updatedData[i].purpose]);
        d3.select(".participant_timestamp").text(updatedData[i].timestamp);
      }, 40 * i * 10);
      timeoutIDArray.push(timeoutID)
    }

    props.onChangeTimeout(timeoutIDArray);
    _svgBaseMap.call(zoom);
  }, [data]);

  return <></>;
}

export default ParticipantMovement;
