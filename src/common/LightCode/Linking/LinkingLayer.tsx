import { ReactNode } from 'react'
import styled from 'styled-components'
import React from 'react'
import { FaChevronRight, FaCheck } from 'react-icons/fa'
import { LineType } from '../LightCodeMgr'

const ICON_SIZE = 24
const ICON_SPACING = 16

export const LinkingLayer = ({ line, isLinking }: { line: LineType, isLinking: boolean }) => {
    // const { linking } = useStore()

    if (!isLinking) {
        return null
    }

    // let iconPosition: [number, number]
    // if (false) {
    //     iconPosition = [line.x2 + ICON_SPACING, line.y2 - ICON_SIZE / 2]
    // } else {
    //     iconPosition = [
    //         line.x2 - ICON_SIZE - ICON_SPACING,
    //         line.y2 - ICON_SIZE / 2,
    //     ]
    // }

    // let icon: ReactNode = <FaChevronRight />
    // if (true) {
    //     icon = <FaCheck />
    // }

    return (
        <svg
            style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
            }}
        >
            <Line
                strokeLinecap="round"
                x1={line.x1}
                x2={line.x2}
                y1={line.y1}
                y2={line.y2}
            />
            <Circle cx={line.x2} cy={line.y2} r={4} />
            {/* <foreignObject x={iconPosition[0]} y={iconPosition[1]} width={24} height={24}>
                <Icon isValid={false}>{icon}</Icon>
            </foreignObject> */}
        </svg>
    )
}

const Line = styled.line`
    stroke-width: 3px;
    stroke: rgb(189,142,242);
`

const Circle = styled.circle`
    fill: #f19494;
`

const Icon = styled.div<{
    isValid: boolean
}>`
    width: ${ICON_SIZE}px;
    height: ${ICON_SIZE}px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: red;
    color: red;
    border: 2px solid red;
    border-radius: ${ICON_SIZE / 2}px;
    font-size: 12px;
`
