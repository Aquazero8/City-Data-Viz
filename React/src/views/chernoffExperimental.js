// import React, { useRef, useEffect, useState } from "react";
import { select, selectAll, csv, path, range } from "d3";
import { svg } from 'htl'

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

function linspace(start, end, n) {
    const step = (end - start) / (n - 1);
    const result = [];

    for (let i = 0; i < n; i++) {
        result.push(start + (step * i));
    }

    return result;
}


function generateFace({
    debug = false,
    width = 170,
    height = 240,
    features = ["mouth", "eyes", "nose", "hair"],

    fill = "hsl(0,0%,95%)",
    stroke = "hsl(0,0%,5%)",
    strokeWidth = 1.5,
    strokeLinejoin = "round",
    strokeLinecap = "round",

    noseWidth = 1,
    noseWobble = 0.5,

    formity = 0.5,
    happiness = 1,

    hairStyle = "parted",
    hairVariation = 0.5,
} = {}) {
    // console.log("recieved happiness", happiness)
    const aspectRatio = width / height;
    const happinessUV = happiness * 0.5 + 0.5;

    const verticalDivisions = 3;
    const verticalDivHeight = height / verticalDivisions;

    const eyelineDivisions = 5;
    const eyelineY = verticalDivHeight + (verticalDivHeight * 1) / 4;
    const eyeWidth = width / eyelineDivisions;

    const earWidth = (eyeWidth * 2) / 5;
    const earHeight = (verticalDivHeight * 2) / 4;

    const mouthLine = verticalDivHeight * 2 + verticalDivHeight / 3;

    const tickSize = 10;

    const drawSkin = () => {
        const faceWidth = width - 2 * earWidth;
        const dCx = (formity * faceWidth) / 5;

        // return (
        //     <g transform={`translate(${earWidth},0)`}>
        //         <path
        //             d={`M${faceWidth / 2},0
        //     Q${faceWidth},0 ${faceWidth},${height / 2}
        //     Q${faceWidth - dCx},${height} ${faceWidth / 2},${height}
        //     Q${dCx},${height} 0,${height / 2}
        //     Q0,0 ${faceWidth / 2},0
        //     Z`}
        //             fill={fill}
        //         ></path>
        //     </g>
        // )
        return `M${faceWidth / 2},0 Q${faceWidth},0 ${faceWidth},${height / 2} Q${faceWidth - dCx},${height} ${faceWidth / 2},${height} Q${dCx},${height} 0,${height / 2} Q 0,0 ${faceWidth / 2},0 Z`
    };

    const drawEars = () => {
        const earDebugStroke = debug ? "red" : "none";
        const earDx = lerp(0, earWidth / 2, formity);
        const d = `M${earWidth * 1.5},${eyelineY}Q${earWidth * 1.5},${verticalDivHeight}${earWidth / 2},${verticalDivHeight}Q${0},${verticalDivHeight} ${0},${eyelineY}Q${earDx},${verticalDivHeight * 2}${earWidth * 1.75},${eyelineY + verticalDivHeight * 0.25}Z`;

        // return (
        //     <g className="ears">
        //         <path d={d} fill={fill} />
        //         <g transform={`scale(-1,1) translate(${-width},0)`}>
        //             <path d={d} fill={fill} />
        //         </g>
        //     </g>
        // );
        return `M ${earWidth * 1.5},${eyelineY}Q${earWidth * 1.5},${verticalDivHeight}${earWidth / 2},${verticalDivHeight}Q${0},${verticalDivHeight} ${0},${eyelineY}Q${earDx},${verticalDivHeight * 2}${earWidth * 1.75},${eyelineY + verticalDivHeight * 0.25}Z`
    };

    const drawEyes = () => {
        if (!features.includes("eyes")) return;

        const eyeY = eyelineY;
        const eyeXFromMid = (eyeWidth * 3) / 4;
        const eyeDx = lerp(0, eyeWidth / 5, happinessUV);
        const eyeStrokeWidth = lerp(
            strokeWidth * 2,
            strokeWidth,
            happinessUV
        );

        return (
            <g className="eyes">
                <line
                    x1={width / 2 - eyeXFromMid - eyeDx}
                    y1={eyeY}
                    x2={width / 2 - eyeXFromMid + eyeDx}
                    y2={eyeY}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={eyeStrokeWidth}
                    strokeLinejoin={strokeLinejoin}
                    strokeLinecap={strokeLinecap}
                />
                <line
                    x1={width / 2 + eyeXFromMid - eyeDx}
                    y1={eyeY}
                    x2={width / 2 + eyeXFromMid + eyeDx}
                    y2={eyeY}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={eyeStrokeWidth}
                    strokeLinejoin={strokeLinejoin}
                    strokeLinecap={strokeLinecap}
                />
            </g>
        );
    };

    const drawNose = () => {
        if (!features.includes("nose")) return;

        const noseWidthDX = lerp(-eyeWidth, eyeWidth, noseWidth);
        const noseCx = width / 2;
        const noseY1 = eyelineY;
        const noseY2 = 2 * verticalDivHeight;

        const dy = lerp(0, verticalDivHeight / 5, noseWobble);

        // if (Math.abs(noseWidth * 2 - 1) < 0.25) return;

        // return (
        //     <g className="nose">
        //         <path
        //             d={`M${noseCx},${noseY1} Q ${noseCx - noseWidthDX},${noseY2 + dy} ${noseCx},${noseY2}`}
        //             r={20}
        //             fill="none"
        //             stroke={stroke}
        //             strokeWidth={strokeWidth}
        //             strokeLinejoin={strokeLinejoin}
        //             strokeLinecap={strokeLinecap}
        //         />
        //     </g>
        // );
        return `M${noseCx},${noseY1} Q ${noseCx - noseWidthDX},${noseY2 + dy} ${noseCx},${noseY2}`
    };

    const drawMouth = () => {
        if (!features.includes("mouth")) return;

        const cx = width / 2;
        const mouthY = mouthLine;
        const mouthDy =
            happiness < 0
                ? lerp(0, -verticalDivHeight / 3, Math.abs(happiness))
                : lerp(0, verticalDivHeight / 2, Math.abs(happiness));
        const mouthDx = lerp(eyeWidth * 0.25, eyeWidth * 0.85, happinessUV);
        // return (
        //     <g className="mouth">
        //         <path
        //             d={`M${cx - mouthDx},${mouthY} Q ${cx},${mouthY + mouthDy} ${cx + mouthDx},${mouthY}`}
        //             r={20}
        //             fill="none"
        //             stroke={stroke}
        //             strokeWidth={strokeWidth}
        //             strokeLinejoin={strokeLinejoin}
        //             strokeLinecap={strokeLinecap}
        //         />
        //     </g>
        // );
        return `M${cx - mouthDx},${mouthY} Q ${cx},${mouthY + mouthDy} ${cx + mouthDx},${mouthY}`
    };

    const drawHair = () => {
        if (!features.includes("hair")) return null;

        if (hairStyle === "flat") {
            const hairY = lerp(
                verticalDivHeight * 0.25,
                verticalDivHeight * 0.75,
                hairVariation
            );
            return (
                <line
                    className="hair"
                    x1={earWidth}
                    y1={hairY}
                    x2={width - earWidth}
                    y2={hairY}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                />
            );
        } else if (hairStyle === "parted") {
            const hairYMin = verticalDivHeight * 0.25;
            const hairPartitionX = lerp(
                earWidth * 3,
                width - earWidth * 3,
                hairVariation
            );
            // return (
            //     <path
            //         className="hair"
            //         d={`M${earWidth},${verticalDivHeight - strokeWidth / 2} 
            //         A ${hairPartitionX - earWidth}
            //         ${verticalDivHeight - hairYMin} 0 0 0 ${hairPartitionX},${hairYMin}
            //         A ${width - earWidth - hairPartitionX}
            //         ${verticalDivHeight - hairYMin}
            //         0 0 0 ${width - earWidth},${verticalDivHeight - strokeWidth / 2}`}
            //         fill="none"
            //         stroke={stroke}
            //         strokeWidth={strokeWidth}
            //         strokeLinejoin={strokeLinejoin}
            //         strokeLinecap={strokeLinecap}
            //     />
            // );
            return `M${earWidth},${verticalDivHeight - strokeWidth / 2} A ${hairPartitionX - earWidth} ${verticalDivHeight - hairYMin} 0 0 0 ${hairPartitionX},${hairYMin} A ${width - earWidth - hairPartitionX} ${verticalDivHeight - hairYMin} 0 0 0 ${width - earWidth},${verticalDivHeight - strokeWidth / 2}`

        } else if (hairStyle === "wavy") {
            const hairYMin = lerp(
                verticalDivHeight * 0.8,
                verticalDivHeight * 0.9,
                hairVariation
            );
            const hairYMax = verticalDivHeight * 1.25 - strokeWidth / 2;
            const hairPartitionX = lerp(
                earWidth * 1.333,
                width - earWidth * 1.333,
                hairVariation
            );
            const partions = 2 * Math.floor(lerp(3, 6, hairVariation));
            const points = linspace(partions + 1, true).map((u, i) => [
                earWidth + u * (width - 2 * earWidth),
                i % 2 === 0 ? hairYMin : hairYMax,
            ]);

            const paths = path();
            points.forEach((p, i) => {
                if (i === 0) {
                    paths.moveTo(...p);
                } else if (i % 2 !== 0) {
                } else {
                    const cx = points[i - 1][0];
                    const cy = points[i - 1][1];
                    paths.quadraticCurveTo(cx, cy, ...p);
                }
            });
            const d = paths.toString();
            // return (
            //     <path
            //         className="hair"
            //         d={d}
            //         fill="none"
            //         stroke={stroke}
            //         strokeWidth={strokeWidth}
            //         strokeLinejoin={strokeLinejoin}
            //         strokeLinecap={strokeLinecap}
            //     />
            // );
            return d
        }
    };

    let debugEls;
    if (debug) {
        debugEls = svg`<g class="debug">
        <rect width=${width} height=${height} stroke="#ff0" fill="none"></rect>
    ${range(verticalDivisions - 1).map(
            (i) =>
                svg`<line
                        x1=0
                        y1=${(i + 1) * verticalDivHeight}
                        x2=${width}
                        y2=${(i + 1) * verticalDivHeight}
                        stroke="#f0f" 
                        stroke-width=${strokeWidth}
                        fill="none"></rect>`
        )}
        <line
        x1="0" y1=${eyelineY}
        x2=${width} y2=${eyelineY}
        stroke="#0ff"
        stroke-width=${strokeWidth}
        ></line>
    ${range(eyelineDivisions + 1).map(
            (i) => svg`<line
        x1=${i * eyeWidth}
        y1=${eyelineY - tickSize / 2}
        x2=${i * eyeWidth}
        y2=${eyelineY + tickSize / 2}
        stroke="#0ff"
        stroke-width=${strokeWidth}></line>`
        )}
    <line
        x1=${eyeWidth * 1.5}
        y1=${mouthLine}
        x2=${width - eyeWidth * 1.5}
        y2=${mouthLine}
        stroke="#0ff"
        stroke-width=${strokeWidth}
        ></line>
    <path
        d="M${width / 2},${eyelineY} 
        L${eyeWidth * 2},${2 * verticalDivHeight}
        L${eyeWidth * 3},${2 * verticalDivHeight}z"
        fill="none"
        stroke="#0ff"
        stroke-width=${strokeWidth}
        ></path>
    </g>`;
    }
    // return (
    //     <svg className="faceSvg h-full">
    //         <g className="face">
    //             {drawSkin()}
    //             {drawEars()}
    //             {drawHair()}
    //             {drawNose()}
    //             {drawEyes()}
    //             {drawMouth()}
    //         </g>
    //     </svg>
    // )
    return [drawSkin(), drawEars(), drawHair(), drawNose(), drawMouth()] // sort out eyes
}

const convertScale = (value) => {
    return (value * 2) - 1;
}

////////////////////////EXPERIMENTAL////////////////////////////////

function translate(point, vec, length = 1, direction = 1) {
    const resultingPoint = {}
    resultingPoint.x = point.x + vec.x * direction * length;
    resultingPoint.y = point.y + vec.y * direction * length;
    return resultingPoint
}


function getPointAndVecAtLength(svgPath, length) {
    const totalLength = svgPath.getTotalLength()
    const resolution = 1024
    const p1 = svgPath.getPointAtLength(length)
    const p2 = svgPath.getPointAtLength(Math.min(length + totalLength / resolution, totalLength))
    const v = vec(p1, p2)
    return {
        x: p1.x,
        y: p1.y,
        v: v
    }
}
function vec(p1, p2) {
    // Returns a ( p1 o-> p2 ) vector object
    // given p1 and p2 objects with the shape {x: number, y: number}

    // horizontal and vertical vector components
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;

    // magnitude of the vector (distance)
    const mag = Math.hypot(dx, dy);

    // unit vector
    const unit = (
        mag !== 0
            ? { x: dx / mag, y: dy / mag }
            : { x: 0, y: 0 }
    );
    function rotate(point, center, radians) {
        const cos = Math.cos(radians),
            sin = Math.sin(radians),
            nx = (cos * (point.x - center.x)) + (sin * (point.y - center.y)) + center.x,
            ny = (cos * (point.y - center.y)) - (sin * (point.x - center.x)) + center.y;
        return { x: nx, y: ny };
    }
    // normal vector
    const normal = rotate(
        unit,
        { x: 0, y: 0 },
        Math.PI / 2
    );

    // Angle in radians
    const radians = Math.atan2(dy, dx);
    // Normalize to clock-wise circle
    const normalized = 2 * Math.PI + Math.round(radians) % (2 * Math.PI)
    // Angle in degrees
    const degrees = 180 * radians / Math.PI;
    const degreesNormalized = (360 + Math.round(degrees)) % 360;

    return {
        dx, dy,
        mag, unit, normal,
        p1: { ...p1 },
        p2: { ...p2 },
        angle: {
            radians,
            normalized,
            degrees,
            degreesNormalized
        }
    };
}




function getColor(percentage) {
    const start = 170 //startHue // 55
    const end = 400 //endHue
    const distance = end - start
    const hue =
        percentage < 0.5
            ? start + distance * percentage * 2
            : end - distance * (percentage - 0.5) * 2
    return `hsl(${hue}, 84%, 62%)`
}



const drawOutline = (s, paths) => {
    let circles = []
    for (const path of paths) {
        const svgPath = svg`<path d="${path}" fill="transparent" stroke="none" stroke-width="0.5px"/>`
        s.appendChild(svgPath)
        const totalLength = svgPath.getTotalLength()
        for (let i = 0; i < 100; i++) {
            const radius = Math.random() * 6 + 1

            const distance = i * totalLength / 100 + Math.random() * totalLength / 100

            const point = svgPath.getPointAtLength(distance)

            // Specific to this demo: get a vector and use it to translate the center
            const point2 = svgPath.getPointAtLength(distance + 0.1)
            const vector = vec(point, point2)
            let percentage = distance / totalLength
            const color = getColor(percentage)
            const translatedCenter = translate(point, vector.normal, radius, 1)
            // const circle = <circle cx={translatedCenter.x} cy={translatedCenter.y} r={radius} fill={color}/>
            const circle = { cx: translatedCenter.x, cy: translatedCenter.y, r: 6, fill: color }
            // s.appendChild(circle)
            circles.push(circle)
        }
    }

    return circles
}
////////////////////////////////////////////////////////

const ChernoffE = (joviality) => {
    // console.log("this is the jobiality", joviality)
    var convertedJoviality = convertScale(joviality.joviality);
    const face = generateFace({ happiness: convertedJoviality })
    // console.log("this is the face", face)
    // call drawShape with the face object
    const xmlns = 'http://www.w3.org/2000/svg';
    const s = svg`<svg class="result" xmlns="${xmlns}" width="300" height="300" viewBox="0 0 200 200" style="max-width: 600px; width: 100%;"/>`
    const circles = drawOutline(s, face) //drawShape(s, face, "in")
    // console.log("this is the draw", circles)
    return (
        <div className="h-custom border border-green-300" style={{ height: '250px' }}>
            {/* {face} */}
            {/* {draw} */}
            <svg className="h-custom border border-green-300" style={{ height: '250px' }}>
                {circles.map(circle => (
                    <circle cx={circle.cx} cy={circle.cy} r={circle.r} fill={circle.fill} />
                ))}
            </svg>

        </div>
    )
};

export default ChernoffE;
