import { Instruments, Notes } from './Constants'

export default new class
{
    Load(instrumentId, midiUsed)
    {
        this.sources = {}
        return new Promise((resolve, reject) =>
        {
            const instrument = Instruments[instrumentId]
            const script = document.createElement('script')
            script.src = `https://rawgit.com/gleitz/midi-js-soundfonts/gh-pages/FluidR3_GM/${instrument}-mp3.js`
            script.onload = _ => resolve(MIDI.Soundfont[instrument])
            script.onerror = reject
            document.head.appendChild(script)
        })
        .then(font => Promise.all
        (
            Object.keys(midiUsed).map(midi =>
            {
                const ixm = midi % 128
                const note = Notes[ixm % 12] + (~~(ixm / 12) - 1)
                return this.Decode(midi, font[note].match(/,(.+)/)[1])
            })
        ))
        .then(evt => Promise.resolve(this.sources))
    }

    Decode(midi, data)
    {
        return new Promise((resolve, reject) =>
        {
            const base64string = atob(data)
            const ab = new ArrayBuffer(base64string.length)
            const bs = new Uint8Array(ab)
            for (let i = 0; i < base64string.length; i++)
                bs[i] = base64string.charCodeAt(i)
            resolve() // audioCtx.decodeAudioData(ab, buffer => (this.sources[midi] = buffer) && resolve())
        })
    }
}
