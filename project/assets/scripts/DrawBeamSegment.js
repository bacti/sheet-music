export default function({ graphics, up, id, src, dest, start = 0, end = 1 })
{
    const [x0, y0] = [src.x - 3, src.y - 40 * id * ~~up + 20 * id]
    const [x1, y1] = [dest.x - 1, dest.y - 40 * id * ~~up + 20 * id]
    const [nx0, ny0] = [x0 + start * (x1 - x0), y0 + start * (y1 - y0)]
    const [nx1, ny1] = [x0 + end * (x1 - x0), y0 + end * (y1 - y0)]

    graphics.moveTo(nx0, ny0)
    graphics.lineTo(nx1, ny1)
    graphics.lineTo(nx1, ny1 - 30 * ~~up + 15)
    graphics.lineTo(nx0, ny0 - 30 * ~~up + 15)
    graphics.lineTo(nx0, ny0)
}
