import * as d3 from 'd3';
import { useEffect } from 'react';

function RentalCostPlot(props){
    var Tooltip = d3
    .select("#tooltip_parent").append("div")
    .style("opacity", 0)
    .attr("class", "tooltip_hover") 

    var data= Object.values(props.data)
    const MAXRENTALCOST = 1602;
    const MINRENTALCOST = 348.4;
    const NUMCOLORS = 6;

    const RENTALBINSIZE = Math.ceil((MAXRENTALCOST - MINRENTALCOST) / NUMCOLORS);
    const CIRCLERADIUS = Array.from({length: NUMCOLORS}, (_, i) => (i + 1) * 2);

    var projection = props.projection;
    var radiusOfCircle, colorOfCircle, className;
    if (props.id === "apartment"){
        radiusOfCircle = 0.8;
        colorOfCircle = "#5A5A5A"
        className = "circleApartment"
    }
    
    useEffect(()=>{
        var _svgBaseMap = d3.select('#svg__baseMap__Rental');
        const width = props.svgDimensions.width;
        const height = props.svgDimensions.height;
        const MARGIN = props.svgDimensions.margin;
        const innerwidth = props.svgDimensions.innerwidth;
        const innerHeight = props.svgDimensions.innerHeight;
        
        const g = _svgBaseMap.select('#map-details');
        const g_ = g.append("g").attr("id",className);

        const colorScale = d3.scaleSequential()
            .interpolator(d3.interpolateOranges)
            .domain([0,NUMCOLORS]);
    
        const orangeColors = d3.range(NUMCOLORS + 1).map(d => colorScale(d));

        const getProjectedCoord = (d) => {
            let xPoint = +d.location.split(" ")[0];
            let yPoint = +d.location.split(" ")[1];
            let projectionCoord = [xPoint, yPoint]
            let xPointProjected = projection(projectionCoord)[0]
            let yPointProjected = projection(projectionCoord)[1]
            return [xPointProjected, yPointProjected]

        }
        data = data.splice(0,data.length-1);
        
        const zoomMap = (event) => {
            let { k, x, y } = event.transform;
            let transform = { k: k, x: x + MARGIN.left, y: y + MARGIN.top }
            g.attr("transform", () => {
                return "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")"
            });
            g.attr("stroke-width", 1 / transform.k);
        }

        let zoom = d3.zoom()
        .scaleExtent([1, 5])
        .on('zoom', zoomMap);

        function mouseover(event,selectedCircle){
            var selectedApartment = d3.select(selectedCircle).datum();
            if (!selectedApartment.numberOfRooms){
                selectedApartment.numberOfRooms = "Not Given"
            }
            var tooltipText = ""
            tooltipText = "Apartment Id: <b>"+selectedApartment.apartmentId+"</b><br>Rent : <b>"+selectedApartment.rent+"</b><br>Location Id: <b>"+selectedApartment.buildingId+"</b><br>No of Rooms: <b>"+selectedApartment.numberOfRooms+"</b><br>Max Occupancy: <b>"+selectedApartment.maxOccupancy+"</b>"
            Tooltip
            .html(tooltipText) //Referred my own code from Homework 1
            .style("left", (event.pageX+15) + "px")
            .style("top", (event.pageY) + "px")
            .style("opacity",1)
        }

        function mouseout(event){
            Tooltip
            .html("")
            .style("opacity",0)
        }

        let apartmentCircle = g_.selectAll(className)
            .data(data)
            .attr("class", "rep_apartment")
            .join("circle")
            .attr("fill", (d)=>{
                return orangeColors[Math.floor((Math.ceil(d.rent)-MINRENTALCOST)/RENTALBINSIZE)]
            })
            .attr("r",(d)=>{
                return CIRCLERADIUS[Math.floor((Math.ceil(d.rent)-MINRENTALCOST)/RENTALBINSIZE)]
            })
            .attr("stroke","black")
            .attr('cx',(d)=>{
                return getProjectedCoord(d)[0]
            })
            .attr('cy',(d)=>{
                return getProjectedCoord(d)[1]
            })
            .on("mouseover",function(event){
                mouseover(event,this);
            })  
            .on("mouseout",mouseout)  ;  


        _svgBaseMap.call(zoom);


    }, []);

    return (
        <>
        </>
    )
}

export default RentalCostPlot;