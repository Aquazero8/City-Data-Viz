import { React, useEffect, useState } from "react";
import "./Financial.css";
import * as d3 from "d3";

function Financial(props) {
  var data = props.financesData;
  const strokeWidth = 3;
  try {
    var participantId = props.participantId;
    var selectedParticipantData = data[participantId];
  } catch (error) {
    console.log("Enter a Valid Participant to see Info");
  }
  useEffect(() => {
    if (participantId) {
      const svg = d3.select("#financial_lineGraph");
      const width = +svg.style("width").replace("px", "");
      const height = +svg.style("height").replace("px", "");
      const margin = { top: 20, bottom: 50, right: 50, left: 60 };
      const innerwidth = width - margin.left - margin.right;
      const innerHeight = height - margin.top - margin.bottom;

      const minValueArray = Object.values(selectedParticipantData);
      const minVal = Math.floor(Math.min(...minValueArray));

      const xScale = d3
        .scaleLinear()
        .domain([0, 1000]) //selectedParticipantData["Shelter"]])
        .range([0, innerwidth])
        .clamp(true);

      const yScale = d3
        .scaleLinear()
        .domain([minVal, selectedParticipantData["Wage"]])
        .range([innerHeight, 0]);

      // var g = svg.append("g")
      // .attr('transform','translate('+ margin.left + ')');

      svg
        .selectAll("g")
        .data([selectedParticipantData])
        .join(
          (enter) => {
            const g = enter.append("g");
            g.append("line")
              .attr("class", "wage")
              .attr("x1", xScale(0))
              .attr("y1", yScale(0))
              .attr("x2", (d) => {
                return xScale(d.Wage);
              })
              .attr("y2", (d) => {
                return yScale(d.Wage);
              })
              .attr("stroke", "green")
              .attr("stroke-width",strokeWidth)
              .attr("transform", "translate(" + margin.left + ")");
            g.append("line")
              .attr("class", "shelter")
              .attr("x1", xScale(0))
              .attr("y1", yScale(0))
              .attr("x2", (d) => {
                return xScale(d.Shelter);
              })
              .attr("y2", (d) => {
                return yScale(d.Shelter);
              })
              .attr("stroke", "red")
              .attr("stroke-width",strokeWidth)
              .attr("transform", "translate(" + margin.left + ")");
            g.append("line")
              .attr("class", "education")
              .attr("x1", xScale(0))
              .attr("y1", yScale(0))
              .attr("x2", (d) => {
                return xScale(d.Education);
              })
              .attr("y2", (d) => {
                return yScale(d.Education);
              })
              .attr("stroke", "blue")
              .attr("stroke-width",strokeWidth)
              .attr("transform", "translate(" + margin.left + ")");
            g.append("line")
              .attr("class", "food")
              .attr("x1", xScale(0))
              .attr("y1", yScale(0))
              .attr("x2", (d) => {
                return xScale(d.Food);
              })
              .attr("y2", (d) => {
                return yScale(d.Food);
              })
              .attr("stroke", "orange")
              .attr("stroke-width",strokeWidth)
              .attr("transform", "translate(" + margin.left + ")");
            g.append("line")
              .attr("class", "recreation")
              .attr("x1", xScale(0))
              .attr("y1", yScale(0))
              .attr("x2", (d) => {
                return xScale(d.Recreation);
              })
              .attr("y2", (d) => {
                return yScale(d.Recreation);
              })
              .attr("stroke", "mustard")
              .attr("transform", "translate(" + margin.left + ")");
          },
          (update) => {
            update.selectAll(".wage").call((update) =>
              update
                .transition()
                .duration(1000)
                .attr("x2", (d) => {
                  return xScale(d.Wage);
                })
                .attr("y2", (d) => {
                  return yScale(d.Wage);
                })
            )
            update.selectAll(".shelter").call((update) =>
              update
                .transition()
                .duration(1000)
                .attr("x2", (d) => {
                  return xScale(d.Shelter);
                })
                .attr("y2", (d) => {
                  return yScale(d.Shelter);
                })
            )
            update.selectAll(".education").call((update) =>
              update
                .transition()
                .duration(1000)
                .attr("x2", (d) => {
                  return xScale(d.Education);
                })
                .attr("y2", (d) => {
                  return yScale(d.Education);
                })
            )
            update.selectAll(".food").call((update) =>
              update
                .transition()
                .duration(1000)
                .attr("x2", (d) => {
                  return xScale(d.Food);
                })
                .attr("y2", (d) => {
                  return yScale(d.Food);
                })
            )
            update.selectAll(".recreation").call((update) =>
              update
                .transition()
                .duration(1000)
                .attr("x2", (d) => {
                  return xScale(d.Recreation);
                })
                .attr("y2", (d) => {
                  return yScale(d.Recreation);
                })
            )
          }
        );

      svg
        .append("g")
        .call(d3.axisBottom(xScale).tickValues([]))
        .attr(
          "transform",
          "translate(" + margin.left + ", " + innerHeight + ")"
        );

      svg
        .append("g")
        .call(
          d3
            .axisLeft(yScale)
            .tickValues(
              d3.range(0, selectedParticipantData["Wage"] + 25000, 25000)
            )
        )
        .attr("transform", "translate(" + margin.left + ")");

    } else {
        console.error("Enter A valid Particiapnt ID");
    }
  }, [participantId, selectedParticipantData]);

  return (
    <>
      <h1>Financial Tab {participantId}</h1>
      <div id="plotFinancial" className="plotFinancial">
        <svg id="financial_lineGraph"> </svg>
      </div>
    </>
  );
}
export default Financial;

// <Int, <String,String>
