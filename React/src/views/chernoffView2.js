// import React, { useRef, useEffect, useState } from "react";
import { select, selectAll, csv, path, range } from "d3";
import { svg } from 'htl'
import * as tome from 'chromotome';

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
    width = 180,
    height = 240,
    features = ["mouth", "eyes", "nose", "hair"],

    fill = "rgb(129, 12, 121)",
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
    console.log("recieved happiness", happiness)
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

        return (
            <g transform={`translate(${earWidth},0)`}>
                <path
                    d={`M${faceWidth / 2},0
            Q${faceWidth},0 ${faceWidth},${height / 2}
            Q${faceWidth - dCx},${height} ${faceWidth / 2},${height}
            Q${dCx},${height} 0,${height / 2}
            Q0,0 ${faceWidth / 2},0
            Z`}
                    fill={fill}
                ></path>
            </g>
        )
    };

    const drawEars = () => {
        const earDebugStroke = debug ? "red" : "none";
        const earDx = lerp(0, earWidth / 2, formity);
        const d = `M${earWidth * 1.5},${eyelineY}
        Q${earWidth * 1.5},${verticalDivHeight}
        ${earWidth / 2},${verticalDivHeight}
        Q${0},${verticalDivHeight} ${0},${eyelineY}
        Q${earDx},${verticalDivHeight * 2}
        ${earWidth * 1.75},${eyelineY + verticalDivHeight * 0.25}
        Z`;

        return (
            <g className="ears">
                <path d={d} fill={fill} />
                <g transform={`scale(-1,1) translate(${-width},0)`}>
                    <path d={d} fill={fill} />
                </g>
            </g>
        );
    };

    const drawEyes = () => {
        if (!features.includes("eyes")) return;

        const eyeY = eyelineY;
        const eyeXFromMid = (eyeWidth * 3) / 4;
        const eyeDx = lerp(0, eyeWidth / 5, happinessUV);
        const eyeStrokeWidth = lerp(
            strokeWidth * 4,
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

        return (
            <g className="nose">
                <path
                    d={`M${noseCx},${noseY1} Q ${noseCx - noseWidthDX},${noseY2 + dy} ${noseCx},${noseY2}`}
                    r={20}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinejoin={strokeLinejoin}
                    strokeLinecap={strokeLinecap}
                />
            </g>
        );
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
        return (
            <g className="mouth">
                <path
                    d={`M${cx - mouthDx},${mouthY} Q ${cx},${mouthY + mouthDy} ${cx + mouthDx},${mouthY}`}
                    r={20}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinejoin={strokeLinejoin}
                    strokeLinecap={strokeLinecap}
                />
            </g>
        );
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
            return (
                <path
                    className="hair"
                    d={`M${earWidth},${verticalDivHeight - strokeWidth / 2} 
                    A ${hairPartitionX - earWidth}
                    ${verticalDivHeight - hairYMin} 0 0 0 ${hairPartitionX},${hairYMin}
                    A ${width - earWidth - hairPartitionX}
                    ${verticalDivHeight - hairYMin}
                    0 0 0 ${width - earWidth},${verticalDivHeight - strokeWidth / 2}`}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinejoin={strokeLinejoin}
                    strokeLinecap={strokeLinecap}
                />
            );
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
            return (
                <path
                    className="hair"
                    d={d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeWidth}
                    strokeLinejoin={strokeLinejoin}
                    strokeLinecap={strokeLinecap}
                />
            );
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
    return (
        <svg className="faceSvg h-full">
            <g className="face">
                {drawSkin()}
                {drawEars()}
                {drawHair()}
                {drawNose()}
                {drawEyes()}
                {drawMouth()}
            </g>
        </svg>
    )
}


const Chernoff = (joviality) => {
    console.log("this is the jobiality", joviality)
    console.log("this is the chernoff face", generateFace());
    const pallete = tome.get('roygbiv-toned')
    const jovToColor = {
        
    }
    console.log("this is the pallete", pallete)

    const face = generateFace({happiness: joviality.joviality})
    return (
        <div className="h-custom border border-green-300" style={{ height: '250px' }}>
            {face}
        </div>
    )
};

export default Chernoff;