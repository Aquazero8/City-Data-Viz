import * as d3 from "d3";
import { participants } from "../constants/constants";
import { useEffect, useRef, useState } from "react";
import "./demographicView.css";
import Chernoff from "./chernoffView";

function Demographics({
  attributeHandler,
  chosenAttr,
  chosenAttrValue,
  isParticipantViewEnabled,
  participantID,
}) {
  // console.log("Chosen attribute value", chosenAttr, "chosen attribute value", chosenAttrValue)
  const [selectedParticipants, setSelectedParticipants] =
    useState(participants);
  var svg1 = useRef();
  var svg2 = useRef();
  var svg3 = useRef();
  var svg4 = useRef();
  var svg5 = useRef();
  var svg6 = useRef();
  var svg7 = useRef();

  useEffect(() => {
    var margin = { top: 20, right: 10, bottom: 40, left: 30 };
    const width = 270;
    const height = 170;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const svgHeight = 200;
    const svgWidth = 270;
    var barWidth;
    var barColorSelected = "#DA1212";
    var barColorDeselected = "grey";
    var barColor = "#11468F";
    var axisFontSize = "14px";
    var pie = d3
      .pie()
      .value(function (d) {
        return d.count;
      })
      .sort(null);
    var selectedRatio = [
      { selected: "yes", count: selectedParticipants.length },
      { selected: "no", count: 1011 - selectedParticipants.length },
    ];
    var color = d3
      .scaleOrdinal()
      .range([
        chosenAttr === "" ? barColor : barColorSelected,
        barColorDeselected,
      ]);
    var radius = 80;
    var donutWidth = 20;
    var arc = d3
      .arc()
      .innerRadius(radius - donutWidth)
      .outerRadius(radius);

    var svg_1 = d3
      .select(svg1.current)
      .attr("height", svgHeight)
      .attr("width", svgWidth);
    var svg_2 = d3
      .select(svg2.current)
      .attr("height", svgHeight)
      .attr("width", svgWidth);
    var svg_3 = d3
      .select(svg3.current)
      .attr("height", svgHeight)
      .attr("width", svgWidth);
    var svg_4 = d3
      .select(svg4.current)
      .attr("height", svgHeight)
      .attr("width", svgWidth);
    var svg_5 = d3
      .select(svg5.current)
      .attr("height", svgHeight)
      .attr("width", svgWidth);
    var svg_6 = d3
      .select(svg6.current)
      .attr("height", svgHeight)
      .attr("width", svgWidth);
    var svg_7 = d3
      .select(svg7.current)
      .attr("height", svgHeight)
      .attr("width", svgWidth)
      .attr("transform", (d) => {
        return "translate(46)";
      });

    var ageGroupCount = {
      "10-19": 0,
      "20-29": 0,
      "30-39": 0,
      "40-49": 0,
      "50-59": 0,
      "60-69": 0,
    };
    var educationLevelCount = {
      Low: 0,
      HighSchoolOrCollege: 0,
      Bachelors: 0,
      Graduate: 0,
    };
    var haveKidsCount = { FALSE: 0, TRUE: 0 };
    var householdSizeCount = { 1: 0, 2: 0, 3: 0 };
    var interestGroupCount = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
      G: 0,
      H: 0,
      I: 0,
      J: 0,
    };
    var jovialityGroupCount = {
      "0-0.25": 0,
      "0.25-0.5": 0,
      "0.5-0.75": 0,
      "0.75-1": 0,
    };

    var ageGroupArray = [];
    var educationLevelArray = [];
    var haveKidsArray = [];
    var householdSizeArray = [];
    var interestGroupArray = [];
    var jovialityGroupArray = [];

    var ageGroupCountFull = {
      "10-19": 0,
      "20-29": 0,
      "30-39": 0,
      "40-49": 0,
      "50-59": 0,
      "60-69": 0,
    };
    var educationLevelCountFull = {
      Low: 0,
      HighSchoolOrCollege: 0,
      Bachelors: 0,
      Graduate: 0,
    };
    var haveKidsCountFull = { FALSE: 0, TRUE: 0 };
    var householdSizeCountFull = { 1: 0, 2: 0, 3: 0 };
    var interestGroupCountFull = {
      A: 0,
      B: 0,
      C: 0,
      D: 0,
      E: 0,
      F: 0,
      G: 0,
      H: 0,
      I: 0,
      J: 0,
    };
    var jovialityGroupCountFull = {
      "0-0.25": 0,
      "0.25-0.5": 0,
      "0.5-0.75": 0,
      "0.75-1": 0,
    };

    var ageGroupArrayFull = [];
    var educationLevelArrayFull = [];
    var haveKidsArrayFull = [];
    var householdSizeArrayFull = [];
    var interestGroupArrayFull = [];
    var jovialityGroupArrayFull = [];

    for (var i = 0; i < selectedParticipants.length; i++) {
      ageGroupCount[selectedParticipants[i]["ageGroup"]]++;
      educationLevelCount[selectedParticipants[i]["educationLevel"]]++;
      haveKidsCount[selectedParticipants[i]["haveKids"]]++;
      householdSizeCount[selectedParticipants[i]["householdSize"]]++;
      interestGroupCount[selectedParticipants[i]["interestGroup"]]++;
      jovialityGroupCount[selectedParticipants[i]["jovialityGroup"]]++;
    }

    for (let elt in ageGroupCount) {
      ageGroupArray.push({
        group: elt,
        count: ageGroupCount[elt],
        type: "Age Group",
      });
    }

    for (let elt in educationLevelCount) {
      educationLevelArray.push({
        group: elt,
        count: educationLevelCount[elt],
        type: "Education Level",
      });
    }

    for (let elt in haveKidsCount) {
      haveKidsArray.push({
        group: elt,
        count: haveKidsCount[elt],
        type: "Have Kids",
      });
    }

    for (let elt in householdSizeCount) {
      householdSizeArray.push({
        group: elt,
        count: householdSizeCount[elt],
        type: "Household Size",
      });
    }

    for (let elt in interestGroupCount) {
      interestGroupArray.push({
        group: elt,
        count: interestGroupCount[elt],
        type: "Interest Group",
      });
    }

    for (let elt in jovialityGroupCount) {
      jovialityGroupArray.push({
        group: elt,
        count: jovialityGroupCount[elt],
        type: "Joviality Group",
      });
    }

    //Full data wrangling
    for (var i = 0; i < participants.length; i++) {
      ageGroupCountFull[participants[i]["ageGroup"]]++;
      educationLevelCountFull[participants[i]["educationLevel"]]++;
      haveKidsCountFull[participants[i]["haveKids"]]++;
      householdSizeCountFull[participants[i]["householdSize"]]++;
      interestGroupCountFull[participants[i]["interestGroup"]]++;
      jovialityGroupCountFull[participants[i]["jovialityGroup"]]++;
    }

    for (let elt in ageGroupCountFull) {
      ageGroupArrayFull.push({
        group: elt,
        count: ageGroupCountFull[elt],
        type: "Age Group",
      });
    }

    for (let elt in educationLevelCountFull) {
      educationLevelArrayFull.push({
        group: elt,
        count: educationLevelCountFull[elt],
        type: "Education Level",
      });
    }

    for (let elt in haveKidsCountFull) {
      haveKidsArrayFull.push({
        group: elt,
        count: haveKidsCountFull[elt],
        type: "Have Kids",
      });
    }

    for (let elt in householdSizeCountFull) {
      householdSizeArrayFull.push({
        group: elt,
        count: householdSizeCountFull[elt],
        type: "Household Size",
      });
    }

    for (let elt in interestGroupCountFull) {
      interestGroupArrayFull.push({
        group: elt,
        count: interestGroupCountFull[elt],
        type: "Interest Group",
      });
    }

    for (let elt in jovialityGroupCountFull) {
      jovialityGroupArrayFull.push({
        group: elt,
        count: jovialityGroupCountFull[elt],
        type: "Joviality Group",
      });
    }

    var tooltip = d3
      .select("#D1")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip_hover");

    tooltip.remove();

    const mouseover = (event, d) => {
      // tooltip.style("opacity", 1)
      tooltip = d3
        .select("#D1")
        .append("div")
        .style("opacity", 1)
        .attr("class", "tooltip_hover");
    };

    const mouseleave = (event, d) => {
      // tooltip.style('opacity', 0);
      tooltip.remove();
    };

    const mousemove = (event, d) => {
      // console.log(event)
      var [x, y] = d3.pointer(event);
      let toolTiptext = `${d.type}: ${d.group}  </br> No of people:${d.count} `;
      tooltip
        .html(toolTiptext) //Referred my own code from Homework 1
        .style("left", event.pageX + 15 + "px")
        .style("top", event.pageY + "px")
        .style("opacity", 1);
      // var x = d3.pointer(event.pageX)
      // // var y = d3.pointer(event.pageY)
      // if (d.type == "Age Group") {
      //     tooltip.html(`${d.type}: ${d.group}  </br> No of people:${d.count} `)
      //         .style('left', `${x + 40}px`)
      //         .style('top', `${y + 120}px`)
      // }
      // else if (d.type == "Education Level") {
      //     tooltip.html(`${d.type}: ${d.group}  </br> No of people:${d.count} `)
      //         .style('left', `${x + 40}px`)
      //         .style('top', `${y + height + 150}px`)
      // }
      // else if (d.type == "Have Kids") {
      //     tooltip.html(`${d.type}: ${d.group}  </br> No of people:${d.count} `)
      //         .style('left', `${x + 40}px`)
      //         .style('top', `${y + height + 350}px`)
      // }
      // else if (d.type == "Household Size") {
      //     tooltip.html(`${d.type}: ${d.group}  </br> No of people:${d.count} `)
      //         .style('left', `${x + 275}px`)
      //         .style('top', `${y + 120}px`)
      // }
      // else if (d.type == "Interest Group") {
      //     tooltip.html(`${d.type}: ${d.group}  </br> No of people:${d.count} `)
      //         .style('left', `${x + width + 40}px`)
      //         .style('top', `${y + height + 150}px`)
      // }
      // else if (d.type == "Joviality Group") {
      //     tooltip.html(`${d.type}: ${d.group}  </br> No of people:${d.count} `)
      //         .style('left', `${x + 275}px`)
      //         .style('top', `${y + height + 350}px`)
      // }
    };

    var x1Scale,
      y1Scale,
      x2Scale,
      y2Scale,
      x3Scale,
      y3Scale,
      x4Scale,
      y4Scale,
      x5Scale,
      y5Scale,
      x6Scale,
      y6Scale;

    const data = chosenAttr === "ageGroup" ? ageGroupArrayFull : ageGroupArray;
    x1Scale = d3
      .scaleBand()
      .domain(data.map((a) => a.group))
      .range([margin.left, innerWidth])
      .padding(0.1);

    y1Scale = d3
      .scaleLinear()
      .domain([0, d3.max(data, (a) => a.count)])
      .range([innerHeight, 0]);

    var xAxis1 = d3.axisBottom(x1Scale);
    var yAxis1 = d3.axisLeft(y1Scale);

    svg_1
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left},${innerHeight + margin.top})`
      )
      .attr("id", "x-axis1");

    d3.select("#x-axis1").transition().duration(1000).call(xAxis1);

    svg_1
      .append("g")
      .attr("transform", `translate(${2 * margin.left},${margin.top})`)
      .attr("id", "y-axis1");

    d3.select("#y-axis1").transition().duration(1000).call(yAxis1);

    svg_1
      .selectAll(".bar")
      .data(chosenAttr === "ageGroup" ? ageGroupArrayFull : ageGroupArray)
      .join("rect")
      .on("click", function (d, i) {
        tooltip.remove();
        // console.log("clicked bar 1")
        attributeHandler("ageGroup", i.group);
      })
      .attr("class", "bar")
      .attr("width", x1Scale.bandwidth())
      .attr("fill", (d) =>
        chosenAttr === "ageGroup" && d.group === chosenAttrValue
          ? barColorSelected
          : chosenAttr === "ageGroup"
          ? barColorDeselected
          : barColor
      )
      .attr("x", function (d) {
        return x1Scale(d.group);
      })
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("mouseover", mouseover)
      .transition()
      .duration(1000)
      .attr("y", function (d) {
        return y1Scale(d.count);
      })
      .attr("height", function (d) {
        return innerHeight - y1Scale(d.count);
      });

    const data2 =
      chosenAttr === "educationLevel"
        ? educationLevelArrayFull
        : educationLevelArray;
    x2Scale = d3
      .scaleBand()
      .domain(data2.map((a) => a.group))
      .range([margin.left, innerWidth])
      .padding(0.1);

    y2Scale = d3
      .scaleLinear()
      .domain([0, d3.max(data2, (a) => a.count)])
      .range([innerHeight, 0]);

    const xAxis2 = d3.axisBottom(x2Scale);
    const yAxis2 = d3.axisLeft(y2Scale);

    svg_2
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left},${innerHeight + margin.top})`
      )
      .attr("id", "x-axis2");

    d3.select("#x-axis2")
      .transition()
      .duration(1000)
      .call(xAxis2)
      .selectAll("text")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-20)");

    svg_2
      .append("g")
      .attr("transform", `translate(${2 * margin.left},${margin.top})`)
      .attr("id", "y-axis2");

    d3.select("#y-axis2").transition().duration(1000).call(yAxis2);

    svg_2
      .selectAll(".bar")
      .data(
        chosenAttr === "educationLevel"
          ? educationLevelArrayFull
          : educationLevelArray
      )
      .join("rect")
      .on("click", function (d, i) {
        tooltip.remove();
        // console.log("clicked bar 2")
        attributeHandler("educationLevel", i.group);
      })
      .attr("class", "bar")
      .attr("width", x2Scale.bandwidth())
      .attr("fill", (d) =>
        chosenAttr === "educationLevel" && d.group === chosenAttrValue
          ? barColorSelected
          : chosenAttr === "educationLevel"
          ? barColorDeselected
          : barColor
      )
      .attr("x", function (d) {
        return x2Scale(d.group);
      })
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("mouseover", mouseover)
      .transition()
      .duration(1000)
      .attr("y", function (d) {
        return y2Scale(d.count);
      })
      .attr("height", function (d) {
        return innerHeight - y2Scale(d.count);
      });

    const data3 = chosenAttr === "haveKids" ? haveKidsArrayFull : haveKidsArray;
    x3Scale = d3
      .scaleBand()
      .domain(data3.map((a) => a.group))
      .range([margin.left, innerWidth])
      .padding(0.1);

    y3Scale = d3
      .scaleLinear()
      .domain([0, d3.max(data3, (a) => a.count)])
      .range([innerHeight, 0]);

    const xAxis3 = d3.axisBottom(x3Scale);
    const yAxis3 = d3.axisLeft(y3Scale);

    svg_3
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left},${innerHeight + margin.top})`
      )
      .attr("id", "x-axis3");

    d3.select("#x-axis3").transition().duration(1000).call(xAxis3);

    svg_3
      .append("g")
      .attr("transform", `translate(${2 * margin.left},${margin.top})`)
      .attr("id", "y-axis3");

    d3.select("#y-axis3").transition().duration(1000).call(yAxis3);

    svg_3
      .selectAll(".bar")
      .data(chosenAttr === "haveKids" ? haveKidsArrayFull : haveKidsArray)
      .join("rect")
      .on("click", function (d, i) {
        tooltip.remove();
        // console.log("clicked bar 3")
        attributeHandler("haveKids", i.group);
      })
      .attr("class", "bar")
      .attr("width", x3Scale.bandwidth())
      .attr("fill", (d) =>
        chosenAttr === "haveKids" && d.group === chosenAttrValue
          ? barColorSelected
          : chosenAttr === "haveKids"
          ? barColorDeselected
          : barColor
      )
      .attr("x", function (d) {
        return x3Scale(d.group);
      })
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("mouseover", mouseover)
      .transition()
      .duration(1000)
      .attr("y", function (d) {
        return y3Scale(d.count);
      })
      .attr("height", function (d) {
        return innerHeight - y3Scale(d.count);
      });

    const data4 =
      chosenAttr === "householdSize"
        ? householdSizeArrayFull
        : householdSizeArray;
    x4Scale = d3
      .scaleBand()
      .domain(data4.map((a) => a.group))
      .range([margin.left, innerWidth])
      .padding(0.1);

    y4Scale = d3
      .scaleLinear()
      .domain([0, d3.max(data4, (a) => a.count)])
      .range([innerHeight, 0]);

    const xAxis4 = d3.axisBottom(x4Scale);
    const yAxis4 = d3.axisLeft(y4Scale);

    svg_4
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left},${innerHeight + margin.top})`
      )
      .attr("id", "x-axis4");

    d3.select("#x-axis4").transition().duration(1000).call(xAxis4);

    svg_4
      .append("g")
      .attr("transform", `translate(${2 * margin.left},${margin.top})`)
      .attr("id", "y-axis4");

    d3.select("#y-axis4").transition().duration(1000).call(yAxis4);

    svg_4
      .selectAll(".bar")
      .data(
        chosenAttr === "householdSize"
          ? householdSizeArrayFull
          : householdSizeArray
      )
      .join("rect")
      .on("click", function (d, i) {
        tooltip.remove();
        // console.log("clicked bar 4")
        attributeHandler("householdSize", i.group);
      })
      .attr("class", "bar")
      .attr("width", x4Scale.bandwidth())
      .attr("fill", (d) =>
        chosenAttr === "householdSize" && d.group === chosenAttrValue
          ? barColorSelected
          : chosenAttr === "householdSize"
          ? barColorDeselected
          : barColor
      )
      .attr("x", function (d) {
        return x4Scale(d.group);
      })
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("mouseover", mouseover)
      .transition()
      .duration(1000)
      .attr("y", function (d) {
        return y4Scale(d.count);
      })
      .attr("height", function (d) {
        return innerHeight - y4Scale(d.count);
      });

    const data5 =
      chosenAttr === "interestGroup"
        ? interestGroupArrayFull
        : interestGroupArray;
    x5Scale = d3
      .scaleBand()
      .domain(data5.map((a) => a.group))
      .range([margin.left, innerWidth])
      .padding(0.1);

    y5Scale = d3
      .scaleLinear()
      .domain([0, d3.max(data5, (a) => a.count)])
      .range([innerHeight, 0]);

    const xAxis5 = d3.axisBottom(x5Scale);
    const yAxis5 = d3.axisLeft(y5Scale);

    svg_5
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left},${innerHeight + margin.top})`
      )
      .attr("id", "x-axis5");

    d3.select("#x-axis5").transition().duration(1000).call(xAxis5);

    svg_5
      .append("g")
      .attr("transform", `translate(${2 * margin.left},${margin.top})`)
      .attr("id", "y-axis5");

    d3.select("#y-axis5").transition().duration(1000).call(yAxis5);

    svg_5
      .selectAll(".bar")
      .data(
        chosenAttr === "interestGroup"
          ? interestGroupArrayFull
          : interestGroupArray
      )
      .join("rect")
      .on("click", function (d, i) {
        tooltip.remove();
        // console.log("clicked bar 5")
        attributeHandler("interestGroup", i.group);
      })
      .attr("class", "bar")
      .attr("width", x5Scale.bandwidth())
      .attr("fill", (d) =>
        chosenAttr === "interestGroup" && d.group === chosenAttrValue
          ? barColorSelected
          : chosenAttr === "interestGroup"
          ? barColorDeselected
          : barColor
      )
      .attr("x", function (d) {
        return x5Scale(d.group);
      })
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("mouseover", mouseover)
      .transition()
      .duration(1000)
      .attr("y", function (d) {
        return y5Scale(d.count);
      })
      .attr("height", function (d) {
        return innerHeight - y5Scale(d.count);
      });

    const data6 =
      chosenAttr === "jovialityGroup"
        ? jovialityGroupArrayFull
        : jovialityGroupArray;
    x6Scale = d3
      .scaleBand()
      .domain(data6.map((a) => a.group))
      .range([margin.left, innerWidth])
      .padding(0.1);

    y6Scale = d3
      .scaleLinear()
      .domain([0, d3.max(data6, (a) => a.count)])
      .range([innerHeight, 0]);

    const xAxis6 = d3.axisBottom(x6Scale);
    const yAxis6 = d3.axisLeft(y6Scale);

    svg_6
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left},${innerHeight + margin.top})`
      )
      .attr("id", "x-axis6");

    d3.select("#x-axis6").transition().duration(1000).call(xAxis6);

    svg_6
      .append("g")
      .attr("transform", `translate(${2 * margin.left},${margin.top})`)
      .attr("id", "y-axis6");

    d3.select("#y-axis6").transition().duration(1000).call(yAxis6);

    svg_6
      .selectAll(".bar")
      .data(
        chosenAttr === "jovialityGroup"
          ? jovialityGroupArrayFull
          : jovialityGroupArray
      )
      .join("rect")
      .on("click", function (d, i) {
        tooltip.remove();
        // console.log("clicked bar 6")
        attributeHandler("jovialityGroup", i.group);
      })
      .attr("class", "bar")
      .attr("width", x6Scale.bandwidth())
      .attr("fill", (d) =>
        chosenAttr === "jovialityGroup" && d.group === chosenAttrValue
          ? barColorSelected
          : chosenAttr === "jovialityGroup"
          ? barColorDeselected
          : barColor
      )
      .attr("x", function (d) {
        return x6Scale(d.group);
      })
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
      .on("mouseover", mouseover)
      .transition()
      .duration(1000)
      .attr("y", function (d) {
        return y6Scale(d.count);
      })
      .attr("height", function (d) {
        return innerHeight - y6Scale(d.count);
      });

    var pie = svg_7.selectAll("path").data(pie(selectedRatio));
    pie
      .enter()
      .append("path")
      .attr("transform", "translate(85,110)")
      .attr("d", arc)
      .attr("stroke", "black")

      .attr("stroke-width", 1)
      .attr("fill", function (d, i) {
        // console.log("donut d", d, "donut d", i)
        return color(d.data.selected);
      });

    pie
      .transition()
      .duration(750)
      .attr("fill", function (d, i) {
        // console.log("donut d", d, "donut d", i)
        return color(d.data.selected);
      })
      .attrTween("d", arcTween);

    function arcTween(a) {
      const i = d3.interpolate(this._current, a);
      this._current = i(0);
      return (t) => arc(i(t));
    }

    //axis labels

    svg_1.append("text").attr("id", "x_text1");

    svg_1.append("text").attr("id", "y_text1");

    d3.select("#x_text1")
      .style("font-size", "14px")
      .attr("transform", "rotate(-90)")
      .attr("y", 25)
      .attr("x", -innerHeight / 2 - 20)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("No of people");

    d3.select("#y_text1")
      .style("font-size", "14px")
      .attr("text-anchor", "middle")
      .attr("x", width / 2 + 20)
      .attr("y", height)
      .style("font-weight", "bold")
      .text("Age Group");

    svg_2.append("text").attr("id", "x_text2");

    svg_2.append("text").attr("id", "y_text2");

    d3.select("#x_text2")
      .style("font-size", "14px")
      .attr("transform", "rotate(-90)")
      .attr("y", 25)
      .attr("x", -innerHeight / 2 - 20)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("No of people");

    d3.select("#y_text2")
      .style("font-size", "14px")
      .attr("text-anchor", "middle")
      .attr("x", width / 2 + 20)
      .attr("y", height)
      .style("font-weight", "bold")
      .text("Education Level");

    svg_3.append("text").attr("id", "x_text3");

    svg_3.append("text").attr("id", "y_text3");

    d3.select("#x_text3")
      .style("font-size", "14px")
      .attr("transform", "rotate(-90)")
      .attr("y", 25)
      .attr("x", -innerHeight / 2 - 20)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("No of people");

    d3.select("#y_text3")
      .style("font-size", "14px")
      .attr("text-anchor", "middle")
      .attr("x", width / 2 + 20)
      .attr("y", height)
      .style("font-weight", "bold")
      .text("Have Kids");

    svg_4.append("text").attr("id", "x_text4");

    svg_4.append("text").attr("id", "y_text4");

    d3.select("#x_text4")
      .style("font-size", "14px")
      .attr("transform", "rotate(-90)")
      .attr("y", 25)
      .attr("x", -innerHeight / 2 - 20)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("No of people");

    d3.select("#y_text4")
      .style("font-size", "14px")
      .attr("text-anchor", "middle")
      .attr("x", width / 2 + 20)
      .attr("y", height)
      .style("font-weight", "bold")
      .text("Household Size");

    svg_5.append("text").attr("id", "x_text5");

    svg_5.append("text").attr("id", "y_text5");

    d3.select("#x_text5")
      .style("font-size", "14px")
      .attr("transform", "rotate(-90)")
      .attr("y", 25)
      .attr("x", -innerHeight / 2 - 20)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("No of people");

    d3.select("#y_text5")
      .style("font-size", "14px")
      .attr("text-anchor", "middle")
      .attr("x", width / 2 + 20)
      .attr("y", height)
      .style("font-weight", "bold")
      .text("Interest Group");

    svg_6.append("text").attr("id", "x_text6");

    svg_6.append("text").attr("id", "y_text6");

    d3.select("#x_text6")
      .style("font-size", "14px")
      .attr("transform", "rotate(-90)")
      .attr("y", 25)
      .attr("x", -innerHeight / 2 - 20)
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("No of people");

    d3.select("#y_text6")
      .style("font-size", "14px")
      .attr("text-anchor", "middle")
      .attr("x", width / 2 + 20)
      .attr("y", height)
      .style("font-weight", "bold")
      .text("Joviality Group");

    svg_6.append("text").attr("id", "y_text6");

    svg_7.append("text").attr("id", "x_text7");

    d3.select("#x_text7")
      .style("font-size", "14px")
      .attr("transform", "translate(88,102)")
      .attr("text-anchor", "middle")
      .style("font-weight", "bold")
      .text("Population ")
      .append("tspan")
      .text(`Selected:`)
      .attr("x", 0)
      .attr("dy", "1.2em")
      .append("tspan")
      .text(`${((selectedRatio[0].count / 1011) * 100).toFixed(2)}%`)
      .attr("x", 0)
      .attr("dy", "1.2em");
  }, [selectedParticipants]);

  useEffect(() => {
    var participantsFiltered = [];
    var participantsMod = isParticipantViewEnabled
      ? [participants[participantID]]
      : participants;
    for (var i = 0; i < participantsMod.length; i++) {
      if (
        chosenAttr === "" ||
        participantsMod[i][chosenAttr] == chosenAttrValue
      ) {
        participantsFiltered.push(participantsMod[i]);
      }
    }
    setSelectedParticipants(participantsFiltered);
  }, [chosenAttr, chosenAttrValue, isParticipantViewEnabled, participantID]);

  return (
    <div className="flex" id="D1">
      <div className="barGraphContainer">
        <div className="barGraphRow1">
          <div>
            <svg ref={svg1}></svg>
          </div>
          <div>
            <svg ref={svg2}></svg>
          </div>
          <div>
            <svg ref={svg3}></svg>
          </div>
        </div>
        <div className="barGraphRow2">
          <div>
            <svg ref={svg4}></svg>
          </div>
          <div>
            <svg ref={svg5}></svg>
          </div>
          <div>
            <svg ref={svg6}></svg>
          </div>
        </div>
      </div>
      <div className="populationSelected_joviality">
        <div className="population_circle">
          <svg ref={svg7}></svg>
          <button
            className="reset_button"
            onClick={() => attributeHandler("", 3)}
          >
            Reset Selection
          </button>
        </div>
        <div className="">
          <Chernoff
            joviality={-1}
            chosenAttr={chosenAttr}
            chosenAttrValue={chosenAttrValue}
            isParticipantViewEnabled={isParticipantViewEnabled}
            participantID={participantID}
          />
        </div>
      </div>
    </div>
  );
}

export default Demographics;
