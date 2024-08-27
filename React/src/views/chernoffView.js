import React, { useRef, useEffect, useState } from "react";
import { select, selectAll, csv, path, range } from "d3";
import { svg } from 'htl'
import * as tome from 'chromotome';
import { participants } from "../constants/constants";

function lerp(start, end, t) {
    return start * (1 - t) + end * t;
}

function linspace(start, stop, n = 60) {
    const step = (stop - start) / (n - 1);
    return Array.from({ length: n }, (_, i) => start + i * step);
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

    noseWidth = 0,
    noseWobble = 0.5,

    formity = 0.5,
    happiness = 1,

    hairStyle = "wavy",
    hairVariation = 0.5,
} = {}) {
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
            // console.log("this is the partions", partions)
            const points = linspace(0, partions + 1).map((u, i) => [
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
        <svg className="faceSvg h-full w-[300px] items-center justify-center content-center">
            <g className="face w-[300px] items-center justify-center content-center" transform="100,100">
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

const getColorTone = (happiness) => {
    const pallete = tome.get('roygbiv-toned')
    // A js function to convert 0 - 1 to 1 - 5
    const colorTone = 5 - (Math.floor(happiness * 4) + 1)
    return pallete.colors[colorTone]
}

const Chernoff = ({ joviality, chosenAttr, chosenAttrValue, isParticipantViewEnabled, participantID }) => {
    // console.log(joviality, chosenAttr, chosenAttrValue)
    const convertedJoviality = joviality * 2 - 1
    const pallete = tome.get('roygbiv-toned')
    const [averageJoviality, setAverageJoviality] = useState(0.9)
    const [face, setFace] = useState(generateFace({
        happiness: 1,//joviality.joviality,
        fill: getColorTone(0.9),
        stroke: 'white',
        noseWidth: Math.random(),
        noseWobble: Math.random(),
        formity: Math.random(),
        hairVariation: Math.random(),
        hairStyle: Math.random() > 0.5 ? "wavy" : "parted",

    }
    ))
    var testJoviality = Math.random() * 2 - 1 // random number between -1 and 1

    useEffect(() => {
        // from participants, which is an array of objects, get the object with the participantID and set it to participant
        // var participant = 
        // console.log("changed  to single part view", isParticipantViewEnabled, participantID, participants[participantID])
        var participantsMod = isParticipantViewEnabled? [participants[participantID]]: participants
        var jovialitySum = 0
        var num = 0
        for (var i = 0; i < participantsMod.length; i++) {
            if (chosenAttr == "" || participantsMod[i][chosenAttr] == chosenAttrValue) {
                jovialitySum += participantsMod[i]['joviality']
                num += 1
            }
        }
        var averageJoviality = (jovialitySum / num).toFixed(2)
        setAverageJoviality(averageJoviality)
        // convert averageJoviality to a number between -1 and 1
        averageJoviality = averageJoviality * 2 - 1
        setFace(generateFace({
            happiness: averageJoviality,//joviality.joviality,
            fill: getColorTone(averageJoviality),
            stroke: 'white',
            noseWidth: Math.random(),
            noseWobble: Math.random(),
            formity: Math.random(),
            hairVariation: Math.random(),
            hairStyle: Math.random() > 0.5 ? "wavy" : "parted",
        }))

    }, [chosenAttr, chosenAttrValue, isParticipantViewEnabled, participantID])

    return (
        <div className="chernoff_container flex flex-col h-96 flex-1 justify-center items-center">
            <div className="chernoff_face h-[250px] w-[185px] flex-6  flex items-center justify-center content-center">
                {face}
            </div>
            <div className="information_cluster flex-0.5 p-1 flex flex-col justify-center items-center">
                <p className="mb-2">{isParticipantViewEnabled? `Participant's`: `Average`} joviality: {averageJoviality}</p>
                {isParticipantViewEnabled && (
                    <p className="mb-2">Age: {isParticipantViewEnabled? participants[participantID].age: '--'}</p>
                )}
                {/* <p className="mb-2">Interest Group:</p> */}
            </div>
        </div>
    )
};

export default Chernoff;