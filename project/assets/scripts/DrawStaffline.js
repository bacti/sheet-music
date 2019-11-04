import { STAVE_OFFSET, FONT_WIDTH, FONT_HEIGHT } from 'Constants'
export default function({ graphics, id, offset, index, length = FONT_WIDTH - 20 })
{
    graphics.rect(offset, STAVE_OFFSET[id] + index * FONT_HEIGHT, length, 4)
    graphics.fillColor = cc.Color.WHITE
    graphics.fill()
}
