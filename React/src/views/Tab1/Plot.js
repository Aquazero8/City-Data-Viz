import * as d3 from 'd3';
import { useEffect } from 'react';

function Plot(props){
    var Tooltip = d3
    .select("#tooltip_parent").append("div")
    .style("opacity", 0)
    .attr("class", "tooltip_hover") 

    var data= Object.values(props.data)
    var projection = props.projection;
    var radiusOfCircle, colorOfCircle, className;
    if (props.id === "apartment"){
        radiusOfCircle = 1;
        colorOfCircle = "#5A5A5A"
        className = "circleApartment"
    }
    else if(props.id === "pubs"){
        radiusOfCircle = 6;
        colorOfCircle = "#2f9fc4ce"
        className = "circlePubs"
    }
    else if(props.id === "school"){
        radiusOfCircle = 6;
        colorOfCircle = "#FEE440CC"
        className = "circleSchools"        
    }
    else if(props.id === "restaurant"){
        radiusOfCircle = 6;
        colorOfCircle = "#61399199"
        className = "circleSchools"       
    }
    else if(props.id === "employer"){
        radiusOfCircle = 3;
        colorOfCircle = "#ff9a02"
        className = "circleEmployers"       
    }
    
    useEffect(()=>{
        var _svgBaseMap = d3.select('#svg__baseMap');
        const width = props.svgDimensions.width;
        const height = props.svgDimensions.height;
        const margin = props.svgDimensions.margin;
        const innerwidth = props.svgDimensions.innerwidth;
        const innerHeight = props.svgDimensions.innerHeight;
        
        const g = _svgBaseMap.select('#map-details');
        const g_ = g.append("g").attr("id",className)

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
            let transform = { k: k, x: x + margin.left, y: y + margin.top }
            g.attr("transform", () => {
                return "translate(" + transform.x + "," + transform.y + ") scale(" + transform.k + ")"
            });
            g.attr("stroke-width", 1 / transform.k);
        }

        let zoom = d3.zoom()
        .scaleExtent([1, 5])
        .on('zoom', zoomMap);

        function mouseover(event,selectedCircle, buildingType){
            var selectedDot = d3.select(selectedCircle).datum();
            var tooltipText = ""
            if (buildingType){
                tooltipText += "Building : <b>"+buildingType.charAt(0).toUpperCase() + buildingType.slice(1)+"</b><br>"
            }
            if (selectedDot.buildingId){
                tooltipText += "Location ID : <b>"+selectedDot.buildingId+"</b><br>"
            }
            if (selectedDot.maxOccupancy){
                tooltipText += "Max Occupancy : <b>"+selectedDot.maxOccupancy+"</b><br>"
            }
            if (buildingType==="pubs"){
                if (selectedDot.pubId){
                    tooltipText += "Building ID : <b>"+selectedDot.pubId+"</b><br>"
                }
            }
            else if(buildingType==="restaurant"){
                    if (selectedDot.restaurantId){
                        tooltipText += "Building ID : <b>"+selectedDot.restaurantId+"</b><br>"
                    }
            }
            else if(buildingType==="school"){
                    if (selectedDot.employerId){
                        tooltipText += "Building ID : <b>"+selectedDot.schoolId+"</b><br>"
                    }
            }
            else if(buildingType==="employer"){
                    if (selectedDot.employerId){
                        tooltipText += "Building ID : <b>"+selectedDot.employerId+"</b><br>"
                    }
            }
            else if(buildingType==="apartment"){
                if (selectedDot.apartmentId){
                    tooltipText += "Building ID : <b>"+selectedDot.apartmentId+"</b><br>"
                }
        }            

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
            .attr("fill", colorOfCircle)
            .attr("r",radiusOfCircle)
            .attr("stroke","black")
            .attr('cx',(d)=>{ 
                return getProjectedCoord(d)[0]
            })
            .attr('cy',(d)=>{
                return getProjectedCoord(d)[1]
            })
            .on("mouseover",function(event){
                mouseover(event,this, props.id);
            })  
            .on("mouseout",mouseout); 
 

        _svgBaseMap.call(zoom);


    }, []);

    return (
        <>
        </>
    )
}

export default Plot;