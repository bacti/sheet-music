import { DOTTED, FONT_HEIGHT, GetNote } from 'Constants'
import DrawMuzik from 'DrawMuzik'
export default function({ node, muzik, chord, up, lineHeight, color })
{
    const { fraction, offset } = chord
    const groups = []
    let shift = false
    chord.reduce(([group, previousPitch], {pitch}) =>
    {
        if (up && pitch == previousPitch + 1)
        {
            shift = true
            group.push(pitch)
            return [group, pitch]
        }
        else
        if (!up && pitch == previousPitch - 1)
        {
            shift = true
            group.push(pitch)
            return [group, pitch]
        }
        const newgroup = [pitch]
        groups.push(newgroup)
        return [newgroup, pitch]
    }, [,-100])

    const np = groups.map(group => GetGroupDotted({ up, group }))
    np.forEach(pitches => pitches.forEach(pitch =>
    {
        DrawMuzik
        ({
            node,
            muzik,
            codes: DOTTED[fraction],
            offset: offset + ~~(up && shift)* 30,
            lineHeight: lineHeight + pitch * FONT_HEIGHT,
            color,
        })
    }))
}

const GetGroupDotted = ({ up, group }) =>
{
    const factor = (~~up * 2 - 1) * 2
    const mean = Math.ceil(group.reduce((sum, pitch) => sum + pitch, 0) / group.length)
    let meanPitch = ~~mean + ~~(Math.abs(~~mean) % 2) + ~~(group.length / 2) * factor
    if (group.length == 1)
        return [meanPitch]
    else
    if (group.length == 2)
        meanPitch = ~~group[0] + ~~(Math.abs(~~group[0]) % 2) + factor
    return group.map((_, i) => meanPitch - i * factor)
}