import { FONT_HEIGHT, GetNote, GetNotation } from 'Constants'
import DrawNotehead from 'DrawNotehead'
import DrawDotted from 'DrawDotted'
import DrawLedger from 'DrawLedger'
import DrawStem from 'DrawStem'
export default function({ node, muzik, muzikSequence, graphics, chord, up, lineHeight, id, clef, minPitch, maxPitch })
{
    const { fraction, duration, offset, timestamp } = chord
    const DrawAction = color =>
    {
        if (chord.length == 1)
        {
            const [{ accidental, pitch }] = chord
            const lineShift = pitch * FONT_HEIGHT
            DrawLedger({ graphics, id, offset, pitch })
            DrawNotehead
            ({
                symbols: GetNote(duration),
                node,
                muzik,
                accidental,
                offset,
                lineHeight,
                lineShift,
                pitch,
                id,
                color,
            })
            DrawDotted({ node, muzik, chord, up, lineHeight, color })
            return [lineShift, ... DrawStem({ up, graphics, color, offset, pitch, duration, id, minPitch: !up && minPitch, maxPitch: up && maxPitch })]
        }
        else
        if (chord.length > 0)
        {
            chord = chord.sort((n1, n2) => up ? n1.pitch - n2.pitch : n2.pitch - n1.pitch)
            const [lastPitch, x, y] = chord.reduce(([previousPitch], { accidental, pitch }) =>
            {
                const lineShift = pitch * FONT_HEIGHT
                let tempPitch = pitch
                let noteOffset = 0
                if (up && pitch == previousPitch + 1)
                {
                    noteOffset = 30
                    tempPitch = -100
                }
                else
                if (!up && pitch == previousPitch - 1)
                {
                    noteOffset = -30
                    tempPitch = -100
                }
                DrawLedger({ graphics, id, offset, pitch })
                DrawNotehead
                ({
                    symbols: GetNote(duration),
                    node,
                    muzik,
                    accidental,
                    offset: offset + noteOffset,
                    lineHeight,
                    lineShift,
                    pitch,
                    id,
                    color,
                })
                return [tempPitch, ... DrawStem({ up, graphics, color, offset, pitch, duration, id, minPitch: !up && minPitch, maxPitch: up && maxPitch })]
            }, [-100])
            DrawDotted({ node, muzik, chord, up, lineHeight, color })
            return [chord.slice(-1)[0].pitch * FONT_HEIGHT, x, y]
        }
    }

    let muzikItem = muzikSequence.find(item => item.timestamp == timestamp)
    if (muzikItem == undefined)
    {
        muzikItem = { notes: [], callbacks: [], timestamp }
        muzikSequence.push(muzikItem)
    }
    muzikItem.callbacks.push({ id, func: color => DrawAction(color) })
    muzikItem.notes = muzikItem.notes.concat
    (
        chord.map(({ accidental, pitch }) => GetNotation
        ({
            id,
            accidental,
            pitch,
            clef,
            duration: duration * (1 + fraction),
        }))
    )

    return DrawAction()
}
