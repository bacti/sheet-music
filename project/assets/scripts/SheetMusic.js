import { PARTITUUR_SAFE_OFFSET, INDICATOR_OFFSET, STAVE_PADDING, STAVE_OFFSET, SYMBOL_SCALE_FACTOR, FONT_WIDTH, FONT_HEIGHT, MAX_ATTEMPT } from 'Constants'
import AbcNotation from 'AbcNotation'
import AudioRecorder from 'AudioRecorder'

cc.macro.ENABLE_WEBGL_ANTIALIAS = (cc.sys.os == cc.sys.OS_WINDOWS)
cc.Class
({
    extends: cc.Component,
    properties:
    {
        doraemon: { default: null, type: cc.Node },
        hellokitty: { default: null, type: cc.Node },
        system: { default: null, type: cc.Node },
        partituur: { default: null, type: cc.Node },
        log: { default: null, type: cc.Node },
    },

    onLoad()
    {
        // cc.debug.setDisplayStats(false)
        cc.Info = message => console.log(message)
        cc.Log = message =>
        {
            const log = this.log.getComponent(cc.Label)
            log.string = message // + '\n' + log.string
            // console.log(message)
        }
        cc.NoteDetected = notations =>
        {
            this.doraemon.disabled != true && this.CheckSound(notations, 1)
            this.hellokitty.disabled != true && this.CheckSound(notations, 2)
        }
        cc.MuzikTapped = id =>
        {
            const muzik = this.muzikTimer[id].find(({ timestamp }) => Math.abs(timestamp - this.muzikTimestamp) < 0.1)
            if (muzik == undefined)
                return
            const { handnotes, handcallbacks, soundFont, color } = muzik
            handcallbacks.forEach(({ func }) => func(color))
            handnotes.forEach(({ notation }) => cc.audioEngine.play(soundFont[notation], false, 1))
        }
        this.muzikTimer = {}

        Promise.resolve()
        .then(evt => AudioRecorder.CheckAuthorization())
        .then(authorised => AudioRecorder.PrepareRecording())
        .then(evt => new Promise((resolve, reject) => cc.loader.loadRes('Sample', (error, asset) =>
        {
            if (error)
            {
                cc.error(error.toString())
                return reject()
            }
            AbcNotation.Parse(asset._nativeAsset).then(tune =>
            {
                // console.log(tune)
                this.system.getComponent('MuziekSysteem').Draw(tune)
                this.partituur.getComponent('Partituur').Draw(tune)
                resolve()
            })
        })))
        .then(evt =>
        {
            const { muzikSequence, muzikLength } = this.partituur
            const midiUsed = new Set()
            const soundFont = {}
            muzikSequence.forEach(({ notes }) => notes.forEach(({ notation }) => midiUsed.add(notation)))
            // console.log(muzikSequence)
            Promise.all
            (
                [...midiUsed].map(midi => new Promise(resolve =>
                {
                    cc.loader.loadRes
                    (
                        'bright_acoustic_piano-mp3/' + midi,
                        cc.AudioClip,
                        (error, resource) =>
                        {
                            cc.audioEngine.play(resource, false, 0)
                            resolve(soundFont[midi] = resource)
                        },
                    )
                }))
            )
            .then(evt => muzikSequence.Play())
            muzikSequence.Play = _ => this.Play({ muzikSequence, muzikLength, soundFont })
        })
    },

    Play({ muzikSequence, muzikLength, soundFont })
    {
        const [ fling, klack ] = this.getComponents(cc.AudioSource)
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
                this.muzikTimestamp = introDistance * beatFactor / -(FONT_WIDTH * SYMBOL_SCALE_FACTOR)
                this.partituur.x = introDistance + INDICATOR_OFFSET
                this.partituur.removeAllChildren()
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
                cc.callFunc(evt => this.partituur.metronome != false && fling.play()),
                cc.delayTime(beatFactor * beat / unit),
            )
            ;[...Array(measure - 1)].forEach
            (
                evt => metronomeSequence.push
                (
                    cc.callFunc(evt => this.partituur.metronome != false && klack.play()),
                    cc.delayTime(beatFactor * beat / unit),
                )
            )
        })
        // console.log(soundFont)

        const beaterBlue = this.PlayHand
        ({
            muzikSequence,
            soundFont,
            introDistance,
            muzikDistance,
            beatFactor,
            beater: this.doraemon,
            color: new cc.Color(0x1A, 0xE1, 0xF8),
            hand: '1',
        })
        beaterBlue.runAction(cc.repeatForever(cc.sequence(beaterBlue.sequence)))

        const beaterPink = this.PlayHand
        ({
            muzikSequence,
            soundFont,
            introDistance,
            muzikDistance,
            beatFactor,
            beater: this.hellokitty,
            color: new cc.Color(255, 192, 203),
            hand: '2',
        })
        beaterPink.runAction(cc.repeatForever(cc.sequence(beaterPink.sequence)))

        this.partituur.runAction(cc.repeatForever(cc.sequence(playSequence)))
        this.partituur.runAction(cc.repeatForever(cc.sequence(metronomeSequence)))
        AudioRecorder.StartRecording()
    },

    PlayHand({ muzikSequence, soundFont, introDistance, muzikDistance, beatFactor, beater, color, hand })
    {
        const star = beater.getComponent('Star')
        let beatDistance = 0
        let laststamp = introDistance / -(FONT_WIDTH * SYMBOL_SCALE_FACTOR)
        let sourcey = undefined
        const noteFilter = note => hand.includes(note.id)
        beater.sequence = []
        this.muzikTimer[hand] = []

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
                        this.scheduleOnce
                        (
                            dt => this.partituur.playback && beater.disabled != true
                                && handnotes.forEach(({ notation }) => cc.audioEngine.play(soundFont[notation], false, 1)),
                            duration * beatFactor,
                        )
                    }),
                ),
            )
            beatDistance += duration * FONT_WIDTH * SYMBOL_SCALE_FACTOR
            laststamp = timestamp
            sourcey = desty
            this.muzikTimer[hand].push({ timestamp: timestamp * beatFactor, handnotes, handcallbacks, soundFont, color })
        })
        beater.sequence.push(star.Jump((muzikDistance - beatDistance) * beatFactor / (FONT_WIDTH * SYMBOL_SCALE_FACTOR), sourcey))
        return beater
    },

    CheckSound(notations, id)
    {
        const muzik = this.muzikTimer[id].find(({ timestamp }) => Math.abs(timestamp - this.muzikTimestamp) < 0.5)
        if (muzik == undefined)
            return
        const { handnotes, handcallbacks, color } = muzik
        handnotes.every(({ notation }) => notations.includes(notation))
            && handcallbacks.forEach(({ func }) => func(color))
    },

    update(deltaTime)
    {
        if (this.partituur.playing == false)
            return
        this.muzikTimestamp += deltaTime
        this.partituur.children.forEach(node =>
        {
            const distance = node.x + this.partituur.x
            node.active = distance > 0 && distance < 1284
        })
    },
})
