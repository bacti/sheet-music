export default function({ graphics, offset, lineWidth = 4 })
{
    graphics.rect(offset, 100, lineWidth, 400)
    graphics.fillColor = new cc.Color(0xFF, 0xFF, 0xFF, 0x77)
    graphics.fill()
}
