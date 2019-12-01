import { SEMIQUAVER } from 'Constants'
import DrawBeamSegment from 'DrawBeamSegment'
export default function({ graphics, muzikSequence, id, up, beamInfo })
{
    const src = beamInfo[0]
    const dest = beamInfo.slice(-1)[0]
    const beamLength = dest.offset - src.offset
    beamInfo.forEach(({ start, end, timestamp, duration }) =>
    {
        const DrawAction = color =>
        {
            DrawBeamSegment
            ({
                graphics,
                up,
                id: 0,
                src,
                dest,
                start: (start - src.offset) / beamLength,
                end: (end - src.offset) / beamLength,
            })
            duration == SEMIQUAVER && DrawBeamSegment
            ({
                graphics,
                up,
                id: 1,
                src,
                dest,
                start: (start - src.offset) / beamLength,
                end: (end - src.offset) / beamLength,
            })
            graphics.fillColor = color
            graphics.fill()
        }
        const muzikItem = muzikSequence.find(item => item.timestamp == timestamp)
        muzikItem.callbacks.push({ id, func: color => DrawAction(color) })
    })

    DrawBeamSegment
    ({
        graphics,
        up,
        id: 0,
        src,
        dest,
    })
    graphics.fillColor = cc.Color.BLACK
    graphics.fill()
}
