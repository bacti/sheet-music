import { STAVE_OFFSET, FONT_HEIGHT } from 'Constants'
export default function({ graphics, slurs })
{
    if (slurs.length == 0)
        return
    const { id } = slurs
    slurs.forEach(([open, closed]) =>
    {
        const up = (open.pitch + closed.pitch) / 2 < 3
        const direction = ~~up * -2.5 + 1.5
        const [offsetOpen, heightOpen] =
        [
            open.offset + 30,
            STAVE_OFFSET[id] + (open.pitch / 2 + direction) * FONT_HEIGHT,
        ]
        const [offsetClosed, heightClosed] =
        [
            closed.offset + 40,
            STAVE_OFFSET[id] + (closed.pitch / 2 + direction) * FONT_HEIGHT,
        ]
        const [offsetMean, heightMean] = [(offsetOpen + offsetClosed) / 2, up ? Math.min(heightOpen, heightClosed) : Math.max(heightOpen, heightClosed)]
        graphics.moveTo(offsetOpen, heightOpen)
        graphics.bezierCurveTo
        (
            offsetOpen,
            heightOpen,
            offsetMean,
            heightMean + direction * (closed.offset - open.offset) * 0.1,
            offsetClosed,
            heightClosed,
        )
        graphics.bezierCurveTo
        (
            offsetClosed,
            heightClosed,
            offsetMean,
            heightMean + direction * ((closed.offset - open.offset) * 0.1 + 10),
            offsetOpen,
            heightOpen,
        )
    })
    graphics.lineWidth = 2
    graphics.strokeColor = cc.Color.BLACK
    graphics.stroke()
    graphics.fillColor = cc.Color.BLACK
    graphics.fill()
}
