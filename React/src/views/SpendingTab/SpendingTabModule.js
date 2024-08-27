import * as d3 from "d3";
import React, { useRef, useEffect, useState } from "react";
import { participants } from "../../constants/constants";
import { financial_spending_data } from "../../constants/constants";
import "./SpendingTabModule.css";

const makeParallelGraph = (props) => {
  plotParallelCoordinateGraph(props, financial_spending_data);
  // add graph labels
  addLedgends();
};


let out_of_focus_opacity = 0.02;
let full_opacity = 1;
let normal_opacity = 0.5;
let line_normal_width = 1;
let line_highlight_width = 2.5;
let axis_labelMargin = 10;

  // const margin = { top: 20, bottom: 20, right: 20, left: 20 };
  const margin = { top: 20, bottom: 10, right: 10, left: 10 };

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




function addLedgends(){

   let parallelPlot = d3.select("#parallel_plot");

   var parallel_s_width =
     +parallelPlot.style("width").replace("px", "") -
     margin.left -
     margin.right;
   var parallel_s_height =
     +parallelPlot.style("height").replace("px", "") -
     margin.top -
     margin.bottom;

  const legend_h = 18,
    legend_w = 18,
    // axis_buffer = legend_w + 10,
    axis_buffer = parallel_s_height / (interest_group_color.length),
    axis_text_margin = 5,
    ledgend_text_margin = 18;

  // console.log("add ledgesd")
 

  parallelPlot.select(".section2_legend").remove();

  const legend = parallelPlot
    .append("g")
    .attr("class", "section2_legend");
    // .attr("transform", "translate(0,0)");

  legend
    .selectAll("rect")
    .data(interest_group_color)
    .enter()
    .append("rect")
    .attr("y", (d, i) => i * axis_buffer)
    .attr("x", ledgend_text_margin)
    .attr("width", legend_w)
    .attr("height", legend_h)
    .attr("fill", (d) => d.color);

  legend
    .selectAll("text")
    .data(interest_group_color)
    .enter()
    .append("text")
    .attr("y", (d, i) => i * axis_buffer + axis_buffer/2)
    .attr("x", 0)
    .text((d) => d.group_i);
}

function getLineColor(entry) {


  let selected_participant = participants.find(
    (d) => d.participantId == entry.participantId
  );
  // console.log("selected_participant[interestGroup] ", selected_participant["interestGroup"]);

  let selected_intrestg = interest_group_color.find(
    (d) => d.group_i == selected_participant["interestGroup"]
  );

  return selected_intrestg.color;
}

function plotParallelCoordinateGraph(props, financialData) {
  //   console.log("financialData", financialData);
  // append g element to svg
  var Tooltip = d3
  .select("#tooltip_parent")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip_hover");

  const parallel_svg = d3.select("#parallel_plot");

  var parallel_s_width =
    +parallel_svg.style("width").replace("px", "") - margin.left - margin.right;
  var parallel_s_height =
    +parallel_svg.style("height").replace("px", "") -
    margin.top -
    margin.bottom;

  // parallel_svg
  //   .style("width", parallel_s_width)
  //   .style("height", parallel_s_height);

  d3.select("#g_parallelPlot").remove();

  const parallel_plot_g = parallel_svg
    .append("g")
    .attr("id", "g_parallelPlot")
    .attr("transform", "translate(0,0)");

  var columnCandidate = ["Wage", "Shelter", "Education", "Food", "Recreation"];

  financialData.forEach((entry) => {
    Object.keys(entry).forEach(function (s) {
      entry[s] = +entry[s]; // converting attribute value to numeric format
    });
  });

  var all_yaxis = {};
  for (let i in columnCandidate) {
    let name = columnCandidate[i];
    all_yaxis[name] = d3
      .scaleLinear()
      .domain(
        d3.extent(financialData, function (d) {
          return d[name];
        })
      )
      .range([parallel_s_height, margin.top]);
  }

  // Build the X scale
  var xScale = d3
    .scalePoint()
    .range([0, parallel_s_width])
    .padding(1)
    .domain(columnCandidate);

  // draw line
  function path(d) {
    return d3.line()(
      columnCandidate.map(function (p) {
        return [xScale(p), all_yaxis[p](d[p])];
      })
    );
  }

  // Draw the axis:
  parallel_plot_g
    .selectAll("myAxis")
    .data(columnCandidate, (reg) => reg)
    .enter()
    .append("g")
    .attr("transform", function (d) {
      return "translate(" + xScale(d) + ")";
    })
    .each(function (d) {
      d3.select(this).call(d3.axisLeft().scale(all_yaxis[d]));
    })
    .append("text")
    .attr("class", "parallel-axis")
    .style("text-anchor", "middle")
    .attr("y", axis_labelMargin)
    .text(function (d) {
      return d;
    })
    .style("fill", "black");

  // draw lines
  parallel_plot_g
    .selectAll("myPath")
    .data(financialData, (d) => d)
    .enter()
    .append("path")
    .attr("class", "spending_lines")
    .attr("id", (d) => "linep" + d.participantId)
    .style("fill", "none")
    .style("stroke", (d) => getLineColor(d))
    .style("stroke-width", line_normal_width)
    .attr("d", path)
    .style("opacity", normal_opacity)
    .on("click", function (event, d) {
      if (d != undefined) {
        props.onChangeParticiapntId(d.participantId);

      }
    })
    .on("mouseover", function (event, d) {
      d3.selectAll(".spending_lines").style("opacity", out_of_focus_opacity);

      d3.select(this)
        .style("stroke", "red")
        .style("opacity", full_opacity)
        .style("stroke-width", line_highlight_width);

      let participantSpendingData = d3.select(this).datum();
      let tooltipText= ""
      let participantID = participantSpendingData.participantId;
      let education = participantSpendingData.Education.toFixed(1);
      let food = participantSpendingData.Food.toFixed(1);
      let recreation = participantSpendingData.Recreation.toFixed(1);
      let shelter = participantSpendingData.Shelter.toFixed(1);
      let wage = participantSpendingData.Wage.toFixed(1);

      tooltipText = "Participant Id: <b>"+participantID+"</b><br>Wage: <b>"+wage+"</b><br>Shelter: <b>"+shelter+"</b><br>Education: <b>"+education+"</b><br>Food: <b>"+food+"</b><br>Recreation: <b>"+recreation+"</b>"
      Tooltip.html(tooltipText) //Referred my own code from Homework 1
      .style("left", event.pageX + 15 + "px")
      .style("top", event.pageY + "px")
      .style("opacity", 1);


    })
    .on("mouseout", function (event, d) {
      //remove border
    props.onMouseOut();
    // console.log("mouse out", props)
      d3.selectAll(".spending_lines")
        .style("opacity", normal_opacity)
        .style("stroke-width", line_normal_width);

      Tooltip.html("").style("opacity", 0);

      // redraw all lines color
    });
}

function highlightSelParticipant(participantID) {
 d3.selectAll(".spending_lines").style("opacity", out_of_focus_opacity);


    d3.select("#linep"+participantID)
      .style("stroke", "red")
      .style("opacity", full_opacity)
      .style("stroke-width", line_highlight_width);
}

function SpendingTabModule(props) {
    var participantID = props.participantID;
    // console.log("participantID", props)
  useEffect(() => {
    makeParallelGraph(props);
  }, []);

  highlightSelParticipant(participantID);

  return (
      <svg id="parallel_plot"> </svg>
  );
}

export default SpendingTabModule;
