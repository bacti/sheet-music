export default function({ graphics, offset, color = cc.Color.WHITE, lineWidth = 4 })
{
    graphics.rect(offset, 100, lineWidth, 400)
    graphics.fillColor = color
    graphics.fill()
}
