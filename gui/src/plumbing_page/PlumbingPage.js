import React, { useContext } from "react";
import { PipeG, ChamberG } from "./PlumbingGauges";
import { RocketState } from "../Context";


export function PlumbingPage() {

    const { pts } =
    useContext(RocketState);
    console.log(pts)

    return (
        <div>
            {/* GN2 TO VENT */}
            <PipeG
                pressure={0}
                x={160}
                y={435}
                width={600}
                keys={["GN2"]}
            />
            {/* PV2 TO */}
            <PipeG
                pressure={0}
                x={160}
                y={835}
                width={300}
            />
            {/* COPV TO */}
            <PipeG
                pressure={0}
                x={460}
                y={235}
                width={10}
                height={600}
            />
            {/* PIPE TO PV1 */}
            <PipeG
                pressure={0}
                x={260}
                y={435}
                width={10}
                height={160}
            />
            {/* PV 1 TO PV 2*/}
            <PipeG
                pressure={0}
                x={260}
                y={745}
                width={10}
                height={90}
            />
            <ChamberG
                pressure={pts.Copv}
                x={395}
                y={10}
                height={250}
                name = "COPV"
            />
            <ChamberG
                pressure={0}
                x={10}
                y={360}
                name = "GN2"
            />
            <ChamberG
                pressure={0}
                x={610}
                y={360}
                name = "VENT"
            />
            <ChamberG
                pressure={0}
                x={185}
                y={595}
                name = "PV1"
            />
            <ChamberG
                pressure={0}
                x={10}
                y={760}
                name = "PV2"
            />
        </div>

    );
}