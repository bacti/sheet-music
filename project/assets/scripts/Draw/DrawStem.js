import { STEM_OFFSET, FONT_WIDTH, FONT_HEIGHT } from 'Constants'
export default function({ graphics, color = cc.Color.BLACK, up, offset, pitch, duration, id, minPitch, maxPitch })
{
    if (duration == 1)
        return [0]
    let length = FONT_HEIGHT * 3.5
    if (maxPitch && up && maxPitch > pitch)
        length += (maxPitch - pitch - 1) * FONT_HEIGHT / 2
    else
    if (minPitch && !up && minPitch < pitch)
        length += (pitch - minPitch - 1) * FONT_HEIGHT / 2
    const [ x, y, w, h ] = up
        ? [offset + 670 * FONT_WIDTH / 1024, STEM_OFFSET[id] + pitch * FONT_HEIGHT / 2, 4, length]
        : [offset + 305 * FONT_WIDTH / 1024, STEM_OFFSET[id] + pitch * FONT_HEIGHT / 2, 4, -length]
    graphics.rect(x, y, w, h)
    graphics.fillColor = color
    graphics.fill()
    return [x + w, y + h]
}
