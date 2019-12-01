import { PARTITUUR_SAFE_OFFSET, INDICATOR_OFFSET, STAVE_PADDING, STAVE_OFFSET, SYMBOL_SCALE_FACTOR, FONT_WIDTH, FONT_HEIGHT, MAX_ATTEMPT } from 'Constants'
import AbcNotation from 'AbcNotation'
import AudioRecorder from 'AudioRecorder'

export default class
{
    static Play({ sheetmusic, muzikSequence, muzikLength, soundFont })
    {
        const [ fling, klack ] = sheetmusic.getComponents(cc.AudioSource)
        const { partituur, doraemon, hellokitty } = sheetmusic
        const { unit, beat, pace, measure } = muzikSequence
        const beatFactor = 60 * unit / (beat * pace)
        const introBars = Math.ceil((PARTITUUR_SAFE_OFFSET - INDICATOR_OFFSET) / (measure * FONT_WIDTH * SYMBOL_SCALE_FACTOR))
        const introDistance = introBars * measure * FONT_WIDTH * SYMBOL_SCALE_FACTOR
        const outroDistance = measure * (1 + 1) * FONT_WIDTH * SYMBOL_SCALE_FACTOR
        const muzikDistance = introDistance + muzikLength + outroDistance
        const playSequence =
        [
            cc.callFunc(evt =>
            {
                sheetmusic.muzikTimestamp = introDistance * beatFactor / -(FONT_WIDTH * SYMBOL_SCALE_FACTOR)
                partituur.x = introDistance + INDICATOR_OFFSET
                partituur.removeAllChildren()
                muzikSequence.callbacks.forEach(func => func(cc.Color.BLACK))
                muzikSequence.forEach(({ callbacks }) => callbacks.forEach(({ func }) => func(cc.Color.BLACK)))
            }),
            cc.moveBy(muzikDistance * beatFactor / (FONT_WIDTH * SYMBOL_SCALE_FACTOR), cc.v2(-muzikDistance, 0)),
        ]
        const metronomeSequence = []
        ;[...Array(~~(muzikLength * beat / (FONT_WIDTH * SYMBOL_SCALE_FACTOR) + introBars + 1))].forEach(evt =>
        {
            metronomeSequence.push
            (
                cc.callFunc(evt => partituur.metronome != false && fling.play()),
                cc.delayTime(beatFactor * beat / unit),
            )
            ;[...Array(measure - 1)].forEach
            (
                evt => metronomeSequence.push
                (
                    cc.callFunc(evt => partituur.metronome != false && klack.play()),
                    cc.delayTime(beatFactor * beat / unit),
                )
            )
        })
        // console.log(soundFont)

        const beaterBlue = this.PlayHand
        ({
            sheetmusic,
            muzikSequence,
            soundFont,
            introDistance,
            muzikDistance,
            beatFactor,
            beater: doraemon,
            color: new cc.Color(0x1A, 0xE1, 0xF8),
            hand: '1',
        })
        beaterBlue.runAction(cc.repeatForever(cc.sequence(beaterBlue.sequence)))

        const beaterPink = this.PlayHand
        ({
            sheetmusic,
            muzikSequence,
            soundFont,
            introDistance,
            muzikDistance,
            beatFactor,
            beater: hellokitty,
            color: new cc.Color(255, 192, 203),
            hand: '2',
        })
        beaterPink.runAction(cc.repeatForever(cc.sequence(beaterPink.sequence)))

        partituur.runAction(cc.repeatForever(cc.sequence(playSequence)))
        partituur.runAction(cc.repeatForever(cc.sequence(metronomeSequence)))
        // AudioRecorder.StartRecording()
    }

    static PlayHand({ sheetmusic, muzikSequence, soundFont, introDistance, muzikDistance, beatFactor, beater, color, hand })
    {
        const star = beater.getComponent('Star')
        const { partituur, muzikTimer } = sheetmusic
        let beatDistance = 0
        let laststamp = introDistance / -(FONT_WIDTH * SYMBOL_SCALE_FACTOR)
        let sourcey = undefined
        const noteFilter = note => hand.includes(note.id)
        beater.sequence = []
        muzikTimer[hand] = []

        muzikSequence.forEach(({ timestamp, notes, callbacks }) =>
        {
            const handnotes = notes.filter(noteFilter)
            const handcallbacks = callbacks.filter(noteFilter)
            if (handnotes.length == 0)
                return

            const duration = timestamp - laststamp
            const desty = STAVE_PADDING / -2 + Math.max(...handnotes.map(({ id, pitch }) => STAVE_OFFSET[id] + (pitch + 1) * FONT_HEIGHT / 2))
            beater.sequence.push
            (
                cc.spawn
                (
                    star.Jump(duration * beatFactor, sourcey, desty),
                    cc.callFunc(evt =>
                    {
                        sheetmusic.scheduleOnce
                        (
                            dt => partituur.playback && beater.disabled != true
                                && handnotes.forEach(({ notation }) => cc.audioEngine.play(soundFont[notation], false, 1)),
                            duration * beatFactor,
                        )
                    }),
                ),
            )
            beatDistance += duration * FONT_WIDTH * SYMBOL_SCALE_FACTOR
            laststamp = timestamp
            sourcey = desty
            muzikTimer[hand].push({ timestamp: timestamp * beatFactor, handnotes, handcallbacks, soundFont, color })
        })
        beater.sequence.push(star.Jump((muzikDistance - beatDistance) * beatFactor / (FONT_WIDTH * SYMBOL_SCALE_FACTOR), sourcey))
        return beater
    }
}
