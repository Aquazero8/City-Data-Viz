
import * as d3 from 'd3'
import { participants } from '../constants/constants';
import { useEffect, useRef, useState } from 'react';

var g1, g2, g3, g4, g5, g6, g7
const makeGraphs = (participantsData, participantsDataFull, chosenAttr, chosenAttrValue, attributeHandler) => {
    var margin = { top: 30, right: 40, bottom: 40, left: 30 };
    const width = 270;
    const height = 170;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    
    var barWidth
    var barColorSelected = "red"
    var barColorDeselected = "grey"
    var barColor = "blue"
   
    var ageGroupCount = { "10-19": 0, "20-29": 0, "30-39": 0, "40-49": 0, "50-59": 0, "60-69": 0 }
    var educationLevelCount = { "Low": 0, "HighSchoolOrCollege": 0, "Bachelors": 0, "Graduate": 0 }
    var haveKidsCount = { "FALSE": 0, "TRUE": 0 }
    var householdSizeCount = { "1": 0, "2": 0, "3": 0 }
    var interestGroupCount = { "A": 0, "B": 0, "C": 0, "D": 0, "E": 0, "F": 0, "G": 0, "H": 0, "I": 0, "J": 0 }
    var jovialityGroupCount = { "0-0.25": 0, "0.25-0.5": 0, "0.5-0.75": 0, "0.75-1": 0 }

    var ageGroupArray = []
    var educationLevelArray = []
    var haveKidsArray = []
    var householdSizeArray = []
    var interestGroupArray = []
    var jovialityGroupArray = []

    var ageGroupCountFull = { "10-19": 0, "20-29": 0, "30-39": 0, "40-49": 0, "50-59": 0, "60-69": 0 }
    var educationLevelCountFull = { "Low": 0, "HighSchoolOrCollege": 0, "Bachelors": 0, "Graduate": 0 }
    var haveKidsCountFull = { "FALSE": 0, "TRUE": 0 }
    var householdSizeCountFull = { "1": 0, "2": 0, "3": 0 }
    var interestGroupCountFull = { "A": 0, "B": 0, "C": 0, "D": 0, "E": 0, "F": 0, "G": 0, "H": 0, "I": 0, "J": 0 }
    var jovialityGroupCountFull = { "0-0.25": 0, "0.25-0.5": 0, "0.5-0.75": 0, "0.75-1": 0 }

    var ageGroupArrayFull = []
    var educationLevelArrayFull = []
    var haveKidsArrayFull = []
    var householdSizeArrayFull = []
    var interestGroupArrayFull = []
    var jovialityGroupArrayFull = []

    var selectedRatio = [{ selected: "yes", count: participantsData.length }, { selected: "no", count: (1011 - participantsData.length) }]
    var color = d3.scaleOrdinal(d3.schemeSet3)
    var radius = 80;
    var donutWidth = 80;
    var arc = d3.arc()
        .innerRadius(radius - donutWidth)
        .outerRadius(radius);


    for (var i = 0; i < participantsData.length; i++) {
        ageGroupCount[participantsData[i]["ageGroup"]]++
        educationLevelCount[participantsData[i]["educationLevel"]]++
        haveKidsCount[participantsData[i]["haveKids"]]++
        householdSizeCount[participantsData[i]["householdSize"]]++
        interestGroupCount[participantsData[i]["interestGroup"]]++
        jovialityGroupCount[participantsData[i]["jovialityGroup"]]++
    }

    for (let elt in ageGroupCount) {

        ageGroupArray.push({ group: elt, count: ageGroupCount[elt] , full: true})

    }
    for (let elt in educationLevelCount) {

        educationLevelArray.push({ group: elt, count: educationLevelCount[elt] })

    }
    for (let elt in haveKidsCount) {

        haveKidsArray.push({ group: elt, count: haveKidsCount[elt] })

    }
    for (let elt in householdSizeCount) {

        householdSizeArray.push({ group: elt, count: householdSizeCount[elt] })

    }
    for (let elt in interestGroupCount) {

        interestGroupArray.push({ group: elt, count: interestGroupCount[elt] })

    }
    for (let elt in jovialityGroupCount) {

        jovialityGroupArray.push({ group: elt, count: jovialityGroupCount[elt] })

    }

    //Full data wrangling

    for (var i = 0; i < participantsDataFull.length; i++) {
        ageGroupCountFull[participantsDataFull[i]["ageGroup"]]++
        educationLevelCountFull[participantsDataFull[i]["educationLevel"]]++
        haveKidsCountFull[participantsDataFull[i]["haveKids"]]++
        householdSizeCountFull[participantsDataFull[i]["householdSize"]]++
        interestGroupCountFull[participantsDataFull[i]["interestGroup"]]++
        jovialityGroupCountFull[participantsDataFull[i]["jovialityGroup"]]++
    }

    for (let elt in ageGroupCountFull) {

        ageGroupArrayFull.push({ group: elt, count: ageGroupCountFull[elt] })

    }
    for (let elt in educationLevelCountFull) {

        educationLevelArrayFull.push({ group: elt, count: educationLevelCountFull[elt] })

    }
    for (let elt in haveKidsCountFull) {

        haveKidsArrayFull.push({ group: elt, count: haveKidsCountFull[elt] })

    }
    for (let elt in householdSizeCountFull) {

        householdSizeArrayFull.push({ group: elt, count: householdSizeCountFull[elt] })

    }
    for (let elt in interestGroupCountFull) {

        interestGroupArrayFull.push({ group: elt, count: interestGroupCountFull[elt] })

    }
    for (let elt in jovialityGroupCountFull) {

        jovialityGroupArrayFull.push({ group: elt, count: jovialityGroupCountFull[elt] })

    }

    //axis settings
    if (chosenAttr == "ageGroup") {
        var x1Scale = d3.scaleBand()
            .domain(ageGroupArrayFull.map(function (a) { return a.group; }))
            .range([0, innerWidth])
            .padding(0.1);
        var y1Scale = d3.scaleLinear()
            .domain([0, d3.max(ageGroupArrayFull, function (a) { return a.count; })])
            .range([innerHeight, 0]);
    }
    else {
        var x1Scale = d3.scaleBand()
            .domain(ageGroupArray.map(function (a) { return a.group; }))
            .range([0, innerWidth])
            .padding(0.1);
        var y1Scale = d3.scaleLinear()
            .domain([0, d3.max(ageGroupArray, function (a) { return a.count; })])
            .range([innerHeight, 0]);
    }


    g1.append('g')
        .attr("id", "y1axis")

    d3.select("#y1axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y1Scale))
        ;

    g1.append('g')
        .attr("id", "x1axis")

    d3.select("#x1axis")
        .attr('transform', `translate(0,${innerHeight})`)
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x1Scale))

    if (chosenAttr == "educationLevel") {
        var x2Scale = d3.scaleBand()
            .domain(educationLevelArrayFull.map(function (a) { return a.group; }))
            .range([0, innerWidth])
            .padding(0.1);
        var y2Scale = d3.scaleLinear()
            .domain([0, d3.max(educationLevelArrayFull, function (a) { return a.count; })])
            .range([innerHeight, 0]);

    }
    else {
        var x2Scale = d3.scaleBand()
            .domain(educationLevelArray.map(function (a) { return a.group; }))
            .range([0, innerWidth])
            .padding(0.1);
        var y2Scale = d3.scaleLinear()
            .domain([0, d3.max(educationLevelArray, function (a) { return a.count; })])
            .range([innerHeight, 0]);
    }


    g2.append('g')
        .attr("id", "y2axis")

    d3.select("#y2axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y2Scale))
        ;

    g2.append('g')
        .attr("id", "x2axis")

    d3.select("#x2axis")
        .attr('transform', `translate(0,${innerHeight})`)
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x2Scale))


    if (chosenAttr == "haveKids") {
        var x3Scale = d3.scaleBand()
            .domain(haveKidsArrayFull.map(function (a) { return a.group; }))
            .range([0, innerWidth])
            .padding(0.1);
        var y3Scale = d3.scaleLinear()
            .domain([0, d3.max(haveKidsArrayFull, function (a) { return a.count; })])
            .range([innerHeight, 0]);

    }
    else {
        var x3Scale = d3.scaleBand()
            .domain(haveKidsArray.map(function (a) { return a.group; }))
            .range([0, innerWidth])
            .padding(0.1);
        var y3Scale = d3.scaleLinear()
            .domain([0, d3.max(haveKidsArray, function (a) { return a.count; })])
            .range([innerHeight, 0]);

    }

    g3.append('g')
        .attr("id", "y3axis")

    d3.select("#y3axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y3Scale))
        ;

    g3.append('g')
        .attr("id", "x3axis")

    d3.select("#x3axis")
        .attr('transform', `translate(0,${innerHeight})`)
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x3Scale))

    if (chosenAttr == "householdSize") {
        var x4Scale = d3.scaleBand()
            .domain(householdSizeArrayFull.map(function (a) { return a.group; }))
            .range([0, innerWidth])
            .padding(0.1);
        var y4Scale = d3.scaleLinear()
            .domain([0, d3.max(householdSizeArrayFull, function (a) { return a.count; })])
            .range([innerHeight, 0]);
    }
    else {
        var x4Scale = d3.scaleBand()
            .domain(householdSizeArray.map(function (a) { return a.group; }))
            .range([0, innerWidth])
            .padding(0.1);
        var y4Scale = d3.scaleLinear()
            .domain([0, d3.max(householdSizeArray, function (a) { return a.count; })])
            .range([innerHeight, 0]);
    }


    g4.append('g')
        .attr("id", "y4axis")

    d3.select("#y4axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y4Scale))
        ;

    g4.append('g')
        .attr("id", "x4axis")

    d3.select("#x4axis")
        .attr('transform', `translate(0,${innerHeight})`)
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x4Scale))

    if (chosenAttr == "interestGroup") {
        var x5Scale = d3.scaleBand()
            .domain(interestGroupArrayFull.map(function (a) { return a.group; }))
            .range([0, innerWidth])
            .padding(0.1);
        var y5Scale = d3.scaleLinear()
            .domain([0, d3.max(interestGroupArrayFull, function (a) { return a.count; })])
            .range([innerHeight, 0]);
    }
    else {
        var x5Scale = d3.scaleBand()
            .domain(interestGroupArray.map(function (a) { return a.group; }))
            .range([0, innerWidth])
            .padding(0.1);
        var y5Scale = d3.scaleLinear()
            .domain([0, d3.max(interestGroupArray, function (a) { return a.count; })])
            .range([innerHeight, 0]);
    }

    g5.append('g')
        .attr("id", "y5axis")

    d3.select("#y5axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y5Scale))
        ;

    g5.append('g')
        .attr("id", "x5axis")

    d3.select("#x5axis")
        .attr('transform', `translate(0,${innerHeight})`)
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x5Scale))

    if (chosenAttr == "jovialityGroup") {
        var x6Scale = d3.scaleBand()
            .domain(jovialityGroupArrayFull.map(function (a) { return a.group; }))
            .range([0, innerWidth])
            .padding(0.1);
        var y6Scale = d3.scaleLinear()
            .domain([0, d3.max(jovialityGroupArrayFull, function (a) { return a.count; })])
            .range([innerHeight, 0]);
    }
    else {
        var x6Scale = d3.scaleBand()
            .domain(jovialityGroupArray.map(function (a) { return a.group; }))
            .range([0, innerWidth])
            .padding(0.1);
        var y6Scale = d3.scaleLinear()
            .domain([0, d3.max(jovialityGroupArray, function (a) { return a.count; })])
            .range([innerHeight, 0]);
    }


    g6.append('g')
        .attr("id", "y6axis")

    d3.select("#y6axis")
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y6Scale))
        ;

    g6.append('g')
        .attr("id", "x6axis")

    d3.select("#x6axis")
        .attr('transform', `translate(0,${innerHeight})`)
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x6Scale))

    // console.log(ageGroupArray)
    g1.selectAll('.rect')
        .data(function () {
            if (chosenAttr == "ageGroup") {

                return ageGroupArrayFull
            }

            else {
                return ageGroupArray
            }
        },d =>d.group)
        .join(
            enter => enter 
                .append("rect")
                // .attr("class", "rect")
                .attr('x', function (a) { return x1Scale(a.group) })
                .attr('y', function (a) { return y1Scale(a.count) })
                .attr('width', x1Scale.bandwidth())
                .attr('height', function (a) { return innerHeight - y1Scale(a.count) })
                .attr('fill', function (d) {
                    if (chosenAttr == "ageGroup" && d.group == chosenAttrValue) {
                        // console.log("entered enter")
                        return barColorSelected
                    }
                    else if (chosenAttr == "ageGroup") {
                        return barColorDeselected
                    }
                    else {
                        // console.log("entered enter")
                        return barColor
                    }
                })

                .on('click', function (d, i) {
                    // console.log("this is i", i, "this is d for on click", d)

                    attributeHandler("ageGroup", i.group)

                }),

            update => update.selectAll('.rect')
                .transition()
                .duration(3000)

                .attr('x', function (a) { return x1Scale(a.group) })
                .attr('y', function (a) { return y1Scale(a.count) })
                .attr('width', x1Scale.bandwidth())
                .attr('height', function (a) { return innerHeight - y1Scale(a.count) })
                .attr('fill', function (d) {
                    if (chosenAttr == "ageGroup" && d.group == chosenAttrValue) {
                        // console.log("entered update")
                        return barColorSelected
                    }
                    else if (chosenAttr == "ageGroup") {
                        return barColorDeselected
                    }
                    else {
                        // console.log("entered update")
                        return barColor
                    }
                })

                .on('click', function (d, i) {
                    // console.log("this is i", i, "this is d for on click", d)

                    attributeHandler("ageGroup", i.group)

                }),
            exit => exit.remove()

        )

    // .transition()
    // .duration(3000)
    // .enter()
    // .append('rect')

    // g1.selectAll('.rect')
    //     .data(function(){
    //         if (chosenAttr == "ageGroup"){

    //             return ageGroupArrayFull
    //         }

    //         else {
    //             return ageGroupArray
    //         }
    //     })
    //     .join('rect')
    //     // .transition()
    //     // .duration(3000)
    //     // .enter()
    //     // .append('rect')
    //     .attr('x', function (a) { return x1Scale(a.group) })
    //     .attr('y', function (a) { return y1Scale(a.count) })
    //     .attr('width', x1Scale.bandwidth())
    //     .attr('height', function (a) { return innerHeight - y1Scale(a.count) })
    //     .attr('fill', function (d) {
    //         if (chosenAttr == "ageGroup" && d.group == chosenAttrValue ) {
    //             return barColorSelected
    //         }
    //         else if (chosenAttr == "ageGroup"){
    //             return barColorDeselected
    //         }
    //         else {
    //             return barColor
    //         }
    //     })

    //     .on('click', function (d, i) {
    //         console.log("this is i", i, "this is d for on click", d)

    //         attributeHandler("ageGroup", i.group)



    //     })

    g2.selectAll('.rect')
        .data(function () {
            if (chosenAttr == "educationLevel") {

                return educationLevelArrayFull
            }

            else {
                return educationLevelArray
            }
        })
        .enter()
        .append('rect')
        .attr('x', function (a) { return x2Scale(a.group) })
        .attr('y', function (a) { return y2Scale(a.count) })
        .attr('width', x2Scale.bandwidth())
        .attr('height', function (a) { return innerHeight - y2Scale(a.count) })
        .attr('fill', function (d) {
            if (chosenAttr == "educationLevel" && d.group == chosenAttrValue) {
                return barColorSelected
            }
            else if (chosenAttr == "educationLevel") {
                return barColorDeselected
            }
            else {
                return barColor
            }
        })
        .on('click', function (d, i) {
            // console.log("this is i", i, "this is d for on click", d)
            attributeHandler("educationLevel", i.group)
        })

    g3.selectAll('.rect')
        .data(function () {
            if (chosenAttr == "haveKids") {

                return haveKidsArrayFull
            }

            else {
                return haveKidsArray
            }
        })
        .enter()
        .append('rect')
        .attr('x', function (a) { return x3Scale(a.group) })
        .attr('y', function (a) { return y3Scale(a.count) })
        .attr('width', x3Scale.bandwidth())
        .attr('height', function (a) { return innerHeight - y3Scale(a.count) })
        .attr('fill', function (d) {
            if (chosenAttr == "haveKids" && d.group == chosenAttrValue) {
                return barColorSelected
            }
            else if (chosenAttr == "haveKids") {
                return barColorDeselected
            }
            else {
                return barColor
            }
        })
        .on('click', function (d, i) {
            // console.log("this is i", i, "this is d for on click", d)
            attributeHandler("haveKids", i.group)
        })

    g4.selectAll('.rect')
        .data(function () {
            if (chosenAttr == "householdSize") {

                return householdSizeArrayFull
            }

            else {
                return householdSizeArray
            }
        })
        .enter()
        .append('rect')
        .attr('x', function (a) { return x4Scale(a.group) })
        .attr('y', function (a) { return y4Scale(a.count) })
        .attr('width', x4Scale.bandwidth())
        .attr('height', function (a) { return innerHeight - y4Scale(a.count) })
        .attr('fill', function (d) {
            if (chosenAttr == "householdSize" && d.group == chosenAttrValue) {
                return barColorSelected
            }
            else if (chosenAttr == "householdSize") {
                return barColorDeselected
            }
            else {
                return barColor
            }
        })
        .on('click', function (d, i) {
            // console.log("this is i", i, "this is d for on click", d)
            attributeHandler("householdSize", i.group)
        })

    g5.selectAll('.rect')
        .data(function () {
            if (chosenAttr == "interestGroup") {

                return interestGroupArrayFull
            }

            else {
                return interestGroupArray
            }
        })
        .enter()
        .append('rect')
        .attr('x', function (a) { return x5Scale(a.group) })
        .attr('y', function (a) { return y5Scale(a.count) })
        .attr('width', x5Scale.bandwidth())
        .attr('height', function (a) { return innerHeight - y5Scale(a.count) })
        .attr('fill', function (d) {
            if (chosenAttr == "interestGroup" && d.group == chosenAttrValue) {
                return barColorSelected
            }
            else if (chosenAttr == "interestGroup") {
                return barColorDeselected
            }
            else {
                return barColor
            }
        })
        .on('click', function (d, i) {
            // console.log("this is i", i, "this is d for on click", d)
            attributeHandler("interestGroup", i.group)
        })

    g6.selectAll('.rect')
        .data(function () {
            if (chosenAttr == "jovialityGroup") {

                return jovialityGroupArrayFull
            }

            else {
                return jovialityGroupArray
            }
        })
        .enter()
        .append('rect')
        .attr('x', function (a) { return x6Scale(a.group) })
        .attr('y', function (a) { return y6Scale(a.count) })
        .attr('width', x6Scale.bandwidth())
        .attr('height', function (a) { return innerHeight - y6Scale(a.count) })
        .attr('fill', function (d) {
            if (chosenAttr == "jovialityGroup" && d.group == chosenAttrValue) {
                return barColorSelected
            }
            else if (chosenAttr == "jovialityGroup") {
                return barColorDeselected
            }
            else {
                return barColor
            }
        })
        .on('click', function (d, i) {
            // console.log("this is i", i, "this is d for on click", d)
            attributeHandler("jovialityGroup", i.group)
        })
    var pie = d3.pie()
        .value(function (d) { return d.count; })
        .sort(null)

    g7.
        selectAll('path')
        .data(pie(selectedRatio))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr("stroke", "black")
        .attr('transform', 'translate(80,80)')
        .attr("stroke-width", 1)
        .attr('fill', function (d, i) {
            // console.log("donut d", d, "donut d", i)
            return color(d.data.selected);
        }

        )
}

function Demographics(
    { attributeHandler, chosenAttr, chosenAttrValue }
) {

    // console.log("Chosen attribute value", chosenAttr, "chosen attribute value", chosenAttrValue)
    const [selectedParticipants, setSelectedParticipants] = useState(participants)

    useEffect(()=>{
        var svg = d3.select("#d_svg")
        // var svg = d3.select(svg_d.current)
        var margin = { top: 30, right: 40, bottom: 40, left: 30 };
        const width = 270;
        const height = 170;
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;
        
        
        g1 = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        g2 = svg.append('g')
            .attr('transform', `translate(${width},${margin.top})`);
        g3 = svg.append('g')
            .attr('transform', `translate(${2 * width},${margin.top})`);
        g4 = svg.append('g')
            .attr('transform', `translate(${margin.left},${height})`);
        g5 = svg.append('g')
            .attr('transform', `translate(${width},${height})`);
        g6 = svg.append('g')
            .attr('transform', `translate(${2 * width},${height})`);
        g7 = svg.append('g')
            .attr('transform', `translate(${3 * width},${margin.top + height / 2})`);
            // console.log("hi")

        makeGraphs(participantsFiltered, participants, chosenAttr, chosenAttrValue, attributeHandler)
        

        },[participants])

    useEffect(() => {
        var participantsMod = participants
        var participantsFiltered = []
        for (var i = 0; i < participantsMod.length; i++) {
            if (chosenAttr == "" || participantsMod[i][chosenAttr] == chosenAttrValue) {
                participantsFiltered.push(participantsMod[i])
            }
        }

        setSelectedParticipants(participantsFiltered)
        // makeGraphs(participantsFiltered, participantsMod, chosenAttr, chosenAttrValue, attributeHandler)


    }, [chosenAttr, chosenAttrValue])


    // var svg_d = useRef();
    var svg_d = <svg id="d_svg" width="100%" height="1000"></svg>
    // call make function


    return (
        <>
            <div >
                {svg_d}
                {/* <svg ref = {svg_d}></svg> */}
            </div>
        </>
    )


}

export default Demographics;