import React, {useContext, useEffect, useState} from "react";
import {PipeG, ChamberG, ValveG} from "./PlumbingGauges";
import {RocketState} from "../Context";

export function PlumbingPage() {
    const [pipeStatuses, setPipeStatuses] = useState({
        copvSection: 0,
        bottomSection: 0,
        regToPv1: 0,
        dlprSection: 0,
        belowDlprSection: 0,
        loxSection: 0,
        lngSection: 0
    });
    const {pts, solenoids} = useContext(RocketState);
    const scaleFactor = 1;
    const BORDER_SIZE = 3;
    useEffect(() => {
        // Copv Section
        let newPipeStatus = {...pipeStatuses};
        if (pts.Copv > 40) {
            newPipeStatus = {...newPipeStatus, copvSection: 1};
        } else {
            newPipeStatus = {...newPipeStatus, copvSection: 0};
        }
        // Reg To PV1
        if (pts.Copv > 40) {
            newPipeStatus = {...newPipeStatus, regToPv1: 1};
        } else {
            if (solenoids.Pv1?.current > 0 && solenoids.Pv2?.current == 0) {
                newPipeStatus = {...newPipeStatus, regToPv1: 0};
            }
        }
        // DLPR Section
        if (newPipeStatus.regToPv1 == 1 && solenoids.Pv1?.current > 0) {
            newPipeStatus = {...newPipeStatus, dlprSection: 1};
        } else {
            if (solenoids.Pv2?.current == 0) {
                newPipeStatus = {...newPipeStatus, dlprSection: 0};
            }
        }
        // Pipes to Tanks
        if (newPipeStatus.dlprSection == 1 && newPipeStatus.copvSection == 1) {
            newPipeStatus.belowDlprSection = 1;
        } else {
            newPipeStatus.belowDlprSection = 0;
        }
        // Tanks
        if (newPipeStatus.dlprSection == 1 && newPipeStatus.copvSection == 1) {
            newPipeStatus.lngSection = 1;
            newPipeStatus.loxSection = 1;
        } else {
            if (pts.Lox < 12) {
                newPipeStatus.loxSection = 0;
            }
            if (pts.Lng < 12) {
                newPipeStatus.lngSection = 0;
            }
        }
        if (pts.Lox > 12) {
            newPipeStatus.loxSection = 1;
        }
        if (pts.Lng > 12) {
            newPipeStatus.lngSection = 1;
        }

        setPipeStatuses(newPipeStatus);
    }, [solenoids, pts]);
    return (
        <div
            style={{
                position: "relative",
                width: `${scaleFactor * 100}px`,
                height: `${scaleFactor * 100}px`,
                transform: `scale(${scaleFactor})`,
                transformOrigin: "top left"
            }}
        >
            {/* COPV TO DLPR */}
            <PipeG
                pressurized={pipeStatuses.copvSection}
                pressure={0}
                x={400}
                y={210 - BORDER_SIZE}
                height={350}
            />
            {/* GN2 TO VENT */}
            <PipeG
                pressurized={pipeStatuses.copvSection}
                x={150}
                y={335}
                width={250 + BORDER_SIZE}
                rightBorder={false}
            />
            <PipeG
                pressurized={pipeStatuses.copvSection}
                x={400 + 15 - BORDER_SIZE}
                y={335}
                width={100}
                leftBorder={false}
            />
            {/* GN2 PIPE TO PV1 REG */}
            <PipeG
                pressurized={pipeStatuses.copvSection}
                pressure={0}
                x={230}
                y={335 + 15 - BORDER_SIZE}
                height={30}
                topBorder={false}
            />
            {/*PV1 REG TO PV*/}
            <PipeG
                pressurized={pipeStatuses.regToPv1}
                pressure={0}
                x={230}
                y={400}
                height={80}
            />
            {/* PV2 TO DLPR */}
            <PipeG
                pressurized={pipeStatuses.dlprSection}
                x={160}
                y={575}
                width={200}
            />
            {/* PV 1 TO PV 2*/}
            <PipeG
                pressurized={pipeStatuses.dlprSection}
                x={230}
                y={555 - BORDER_SIZE}
                height={20 + 2 * BORDER_SIZE}
                bottomBorder={false}
            />
            {/*  DLPR TO LNG AND LOX*/}
            <PipeG
                pressurized={pipeStatuses.belowDlprSection}
                pressure={0}
                x={400}
                y={600}
                height={350}
            />
            {/* to lox */}
            <PipeG
                pressurized={pipeStatuses.belowDlprSection}
                x={250}
                y={640}
                width={150 + BORDER_SIZE}
                rightBorder={false}
            />
            {/* to lng */}
            <PipeG
                pressurized={pipeStatuses.belowDlprSection}
                x={250}
                y={935}
                width={150 + BORDER_SIZE}
                rightBorder={false}
            />

            {/*LOX*/}
            <PipeG
                pressurized={pipeStatuses.loxSection}
                x={230}
                y={640}
                width={100}
            />
            <PipeG
                pressurized={pipeStatuses.loxSection}
                x={230}
                y={880 - BORDER_SIZE}
                height={35 + BORDER_SIZE}
            />
            <PipeG
                pressurized={pipeStatuses.loxSection}
                x={350}
                y={900}
                height={325 - BORDER_SIZE}
            />
            <PipeG
                pressurized={pipeStatuses.loxSection}
                x={245 - BORDER_SIZE}
                y={900}
                width={105 + 2 * BORDER_SIZE}
                rightBorder={false}
                leftBorder={false}
            />
            <PipeG
                pressurized={pipeStatuses.loxSection}
                x={230}
                y={655 - BORDER_SIZE}
                height={50}
                topBorder={false}
            />
            {/*LNG*/}
            <PipeG
                pressurized={pipeStatuses.lngSection}
                x={230}
                y={935}
                width={100}
            />
            <PipeG
                pressurized={pipeStatuses.lngSection}
                x={230}
                y={1095 - BORDER_SIZE}
                height={35 + BORDER_SIZE}
            />
            <PipeG
                pressurized={pipeStatuses.lngSection}
                x={230}
                y={950 - BORDER_SIZE}
                height={30}
                topBorder={false}
            />
            <PipeG
                pressurized={pipeStatuses.lngSection}
                x={230}
                y={1175 - BORDER_SIZE}
                height={50}
            />
            {/*regulators */}
            {/*LNG*/}
            <img
                src="/check_valve_white.png"
                style={{
                    position: "absolute",
                    top: 917,
                    left: 290,
                    width: 50,
                    height: 50,
                    transform: "rotate(180deg)",
                    zIndex: 9999
                }}
            />
            {/*LOX*/}
            <img
                src="/check_valve_white.png"
                style={{
                    position: "absolute",
                    top: 622,
                    left: 290,
                    width: 50,
                    height: 50,
                    transform: "rotate(180deg)",
                    zIndex: 9999
                }}
            />
            {/*PV1 Check*/}
            <img
                src="/check_valve_white.png"
                style={{
                    position: "absolute",
                    top: 370,
                    left: 213,
                    width: 50,
                    height: 50,
                    transform: "rotate(90deg)",
                    zIndex: 9999
                }}
            />
            {/*dlpr */}
            <img
                src="/dlpr_white.png"
                style={{
                    position: "absolute",
                    top: 541,
                    left: 354,
                    width: 80,
                    height: 80,
                    zIndex: 9999
                }}
            />
            <ChamberG
                pressure={pipeStatuses.copvSection}
                x={331}
                y={10}
                name="COPV"
            />
            <ChamberG
                pressure={pipeStatuses.loxSection}
                x={163}
                y={680}
                name="LOX"
            />
            <ChamberG
                pressure={pipeStatuses.lngSection}
                x={163}
                y={975}
                name="LNG"
            />
            <ValveG
                pressure={solenoids.Gn2Fill?.current}
                x={10}
                y={300}
                name="GN2 Fill"
            />
            <ValveG
                pressure={solenoids.CopvVent?.current}
                x={500}
                y={300}
                name="COPV Vent"
            />
            <ValveG
                pressure={solenoids.Pv1?.current}
                x={163}
                y={480 - BORDER_SIZE}
                name="PV1"
            />
            <ValveG
                pressure={!solenoids.Pv2?.current}
                x={10 + BORDER_SIZE}
                y={541}
                name="PV2"
            />
        </div>
    );
}
