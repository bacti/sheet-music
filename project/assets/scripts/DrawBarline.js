export default function({ graphics, offset, lineWidth = 4 })
{
    graphics.rect(offset, 68, lineWidth, 400)
    graphics.fillColor = cc.Color.WHITE
    graphics.fill()
}
