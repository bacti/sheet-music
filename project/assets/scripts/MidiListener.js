import { LETTERS } from 'Constants'
export default new class
{
    Set({ sheetmusic })
    {
        const { doraemon, hellokitty } = sheetmusic
        this.notes = {}

        cc.OnKeyPressed = (midi, velocity) =>
        {
            const notation = this.ToNotation({ midi })
            this.notes[notation] = true
            this.CheckMidi({ sheetmusic, beater: doraemon, hand: 1 })
            this.CheckMidi({ sheetmusic, beater: hellokitty, hand: 2 })
        }

        cc.OnKeyReleased = (midi, velocity) =>
        {
            const notation = this.ToNotation({ midi })
            this.notes[notation] = false
        }
    }

    ToNotation({ midi })
    {
        const octave = ~~(midi / 12) - 1
        const tone = midi % 12
        return LETTERS[tone] + octave
    }

    CheckMidi({ sheetmusic, beater, hand })
    {
        if (beater.disabled == true)
            return

        const muzik = sheetmusic.GetCurrentMuzik({ hand, tolerance: 0.5 })
        if (muzik == undefined)
            return

        const { handnotes, handcallbacks, color } = muzik
        handnotes.every(({ notation }) => this.notes[notation])
            && handcallbacks.forEach(({ func }) => func(color))
    }
}
