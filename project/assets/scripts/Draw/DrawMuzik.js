import { FONT_SIZE } from 'Constants'
export default function({ node, muzik, codes, offset = 0, lineHeight = 0, fontSize = FONT_SIZE, color = cc.Color.BLACK })
{
    if (codes == undefined)
        return
    const symbol = cc.instantiate(muzik)
    const symbolText = symbol.getComponent(cc.Label)
    symbolText.string = codes
    symbolText.fontSize = fontSize
    symbolText.lineHeight = lineHeight
    node.addChild(symbol)
    symbol.x = offset
    symbol.color = color
    return symbol
}
