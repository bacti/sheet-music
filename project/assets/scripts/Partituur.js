import
{
    CROTCHET, QUAVER, SEMIQUAVER,
    CLEFS, REST, OCTAVE, SYMBOL_SCALE_FACTOR, STAVE_PADDING, STAVE_OFFSET, BAR_OFFSET, FONT_HEIGHT, FONT_WIDTH,
    GetFlag,
    GetDynamic,
    GetRestDotted,
} from 'Constants'
import DrawBarline from 'DrawBarline'
import DrawMuzik from 'DrawMuzik'
import DrawChord from 'DrawChord'
import DrawFlag from 'DrawFlag'
import DrawBeam from 'DrawBeam'
import DrawSlurs from 'DrawSlurs'

cc.Class
({
    extends: cc.Component,
    properties:
    {
        muzik: { default: null, type: cc.Prefab },
    },

    DrawSymbols(id, tune)
    {
        const graphics = this.node.getComponent(cc.Graphics)
        const { node, muzik } = this
        const { muzikSequence } = this.node
        const { clef, raw, unit } = tune.voices[id]
        const fontTable = CLEFS[clef]
        const bars = raw.split('|').slice(0, -1)
        const lineHeight = (2 - id) * STAVE_PADDING
        const slurs = []
        let slurOpen = null
        let index = 0
        bars.forEach(bar =>
        {
            const groups = bar.trim().split(/\x20+/)
            groups.forEach(group =>
            {
                const beam = []       
                let beamPitch = 0
                let minPitch = 1000, maxPitch = -1000
                beam.duration = 1

                group.replace(/(![mpf>]+!)|(\()?(![mpf>]+!)?(\[[A-Ga-gz\^\+\=\_\-\.,']+\]|[\^\+\=\_\-\.]*[A-Ga-gz][,']*)([\/\d]*)(\))?/g, (_, dynamic = '', slurOn, subdynamic, notes, length, slurOff) =>
                {
                    const offset = index * FONT_WIDTH
                    if (dynamic || subdynamic)
                    {
                        muzikSequence.callbacks.push
                        (
                            color => DrawMuzik
                            (
                                Object.assign
                                (
                                    { node, muzik },
                                    GetDynamic
                                    ({
                                        dynamic: (dynamic || subdynamic).replace(/!/g, ''),
                                        offset,
                                        lineHeight: lineHeight - FONT_HEIGHT * 8,
                                    }),
                                )
                            )
                        )
                        if (subdynamic == undefined)
                            return
                    }

                    const [n, p = 1] = length.split('/')
                    length = (unit / tune.unit) * (n || 1) / p
                    const integral = 2 ** ~~(Math.log(length) / Math.log(2))
                    const fraction = (length - integral) / integral
                    const duration = tune.unit * integral
                    let chord = Object.assign([], { fraction, duration, offset, timestamp: index / SYMBOL_SCALE_FACTOR })
                    let chordPitch = 0

                    notes
                    .replace(/[a-g]/g, char => char.toLocaleUpperCase() + `'`)
                    .replace(/([\^\+\=\_\-\.]?)(?:[\^\+\=\_\-\.]*)([A-Gz])([,']*)/g, (_, accidental, note, sign) =>
                    {
                        if (note == 'z')
                        {
                            muzikSequence.callbacks.push
                            (
                                color => DrawMuzik
                                ({
                                    codes: REST[duration],
                                    node,
                                    muzik,
                                    offset,
                                    lineHeight,
                                }),
                                color => DrawMuzik
                                (
                                    Object.assign
                                    (
                                        { node, muzik },
                                        GetRestDotted(fraction, duration, index * FONT_WIDTH, lineHeight),
                                    )
                                ),
                            )
                            return
                        }
                        
                        const pitch = [...sign].reduce((pitch, sign) => pitch + OCTAVE[sign], fontTable[note].pitch)
                        chord.push({ accidental, pitch })
                        chordPitch += pitch
                        minPitch = Math.min(minPitch, pitch)
                        maxPitch = Math.max(maxPitch, pitch)
                    })

                    if (chord.length == 0)
                    {
                        index += length * SYMBOL_SCALE_FACTOR
                        return
                    }

                    chord.pitch = chordPitch / chord.length
                    beamPitch += chord.pitch
                    beam.duration = Math.min(beam.duration, duration)
                    beam.push(chord)

                    // make slurs
                    {
                        const peak = { offset, pitch: chord.pitch < 3 ? minPitch : maxPitch }
                        slurOn && (slurOpen = peak)
                        slurOff && slurs.push([ slurOpen, peak ])
                    }

                    index += length * SYMBOL_SCALE_FACTOR
                })

                const up = beamPitch / beam.length < 3
                if (beam.length == 1)
                {
                    const [ chord ] = beam
                    const { duration, offset, timestamp } = chord
                    const [ lastLineShift ] = DrawChord({ node, muzik, muzikSequence, graphics, chord, up, lineHeight, id, clef })
                    DrawFlag({ node, muzik, muzikSequence, id, up, duration, offset, lineHeight, lastLineShift, timestamp })
                }
                else
                if (beam.length > 0)
                {
                    const beamInfo = beam.map
                    (
                        (chord, index) =>
                        {
                            const { offset, duration, timestamp } = chord
                            const [, x, y] = DrawChord({ node, muzik, muzikSequence, graphics, chord, up, lineHeight, id, clef, minPitch, maxPitch })
                            const lastChord = beam[index - 1] || {}
                            const nextChord = beam[index + 1] || {}
                            let start = offset
                            let end = offset
                            if (duration == SEMIQUAVER)
                            {
                                switch (nextChord.duration)
                                {
                                    case QUAVER:
                                    {
                                        switch (lastChord.duration)
                                        {
                                            case QUAVER:
                                                end += 0.5 * (lastChord.offset - offset) * unit / lastChord.duration
                                            break
                                            case SEMIQUAVER:
                                                end += 0.5 * (lastChord.offset - offset) * unit / lastChord.duration
                                            break
                                            case undefined:
                                                end += 0.5 * (nextChord.offset - offset) * unit / duration
                                            break
                                        }
                                    }
                                    break
                                    case SEMIQUAVER:
                                    {
                                        lastChord.duration == SEMIQUAVER && (start += 0.5 * (lastChord.offset - offset) * unit / lastChord.duration)
                                        end += 0.5 * (nextChord.offset - offset) * unit / duration
                                    }
                                    break
                                    case undefined:
                                        end += 0.5 * (lastChord.offset - offset) * unit / lastChord.duration
                                    break
                                }
                            }
                            else
                            if (duration == QUAVER)
                            {
                                nextChord.duration == undefined
                                    ? (end += 0.5 * (lastChord.offset - offset) * unit / lastChord.duration)
                                    : (end += 0.5 * (nextChord.offset - offset) * unit / duration)
                            }
                            return { x, y, offset, start, end, timestamp, duration }
                        }
                    )
                    beam.duration < CROTCHET && DrawBeam({ graphics, muzikSequence, id, up, beamInfo })
                }
            })
            this.barlines.add(index - BAR_OFFSET)
        })
        slurs.id = id
        DrawSlurs({ graphics, slurs })
        this.node.muzikLength = index * FONT_WIDTH
    },

    Draw(tune)
    {
        const graphics = this.node.getComponent(cc.Graphics)
        const { unit, beat, pace, measure } = tune
        this.node.muzikSequence = Object.assign([], { unit, beat, pace, measure, callbacks: [], playMuzik: {} })
        this.barlines = new Set()

        for (let id in tune.voices)
            this.DrawSymbols(id, tune)
        this.node.muzikSequence.sort((n1, n2) => n1.timestamp - n2.timestamp)

        ;[...this.barlines].map(position => DrawBarline({ graphics, offset: position * FONT_WIDTH }))
        DrawBarline({ graphics, offset: this.node.muzikLength - BAR_OFFSET * FONT_WIDTH + 12, lineWidth: 10 })
    },
})
