import { GetFlag } from 'Constants'
import DrawMuzik from 'DrawMuzik'
export default function({ node, muzik, muzikSequence, id, up, duration, offset, lineHeight, lastLineShift, timestamp })
{
    const DrawAction = color =>
    {
        DrawMuzik
        (
            Object.assign
            (
                { node, muzik, color },
                GetFlag
                ({
                    up,
                    duration,
                    offset,
                    lineHeight: lineHeight + lastLineShift,
                }),
            )
        )
    }
    const muzikItem = muzikSequence.find(item => item.timestamp == timestamp)
    muzikItem.callbacks.push({ id, func: color => DrawAction(color) })
}
