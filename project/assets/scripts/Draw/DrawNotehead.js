import { FONT_WIDTH, GetAccidental } from 'Constants'
import DrawMuzik from 'DrawMuzik'
export default function({ node, muzik, symbols, accidental, offset, lineHeight, lineShift, color })
{
    DrawMuzik
    (
        Object.assign
        (
            { node, muzik, color },
            GetAccidental({ accidental, offset, lineHeight: lineHeight + lineShift }),
        )
    )
    symbols.forEach
    (
        codes => DrawMuzik
        ({
            node,
            muzik,
            codes,
            offset,
            lineHeight: lineHeight + lineShift,
            color,
        })
    )
}
