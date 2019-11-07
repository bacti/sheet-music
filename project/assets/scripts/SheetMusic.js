import { PARTITUUR_OFFSET, INDICATOR_OFFSET, SYMBOL_SCALE_FACTOR, FONT_WIDTH } from 'Constants'
import AbcNotation from 'AbcNotation'
import AudioRecorder from 'AudioRecorder'

cc.macro.ENABLE_WEBGL_ANTIALIAS = (cc.sys.os == cc.sys.OS_WINDOWS)
cc.Class
({
    extends: cc.Component,
    properties:
    {
        star: { default: null, type: cc.Node },
        system: { default: null, type: cc.Node },
        partituur: { default: null, type: cc.Node },
        log: { default: null, type: cc.Node },
    },

    onLoad()
    {
        const deviceSize = cc.view.getVisibleSize()
        this.star.y = 480 - deviceSize.height / 2
        this.node.y -= deviceSize.height / 2
        this.system.y -= deviceSize.height / 2
        this.log.y = deviceSize.height / 2
        cc.debug.setDisplayStats(false)

        cc.Log = message =>
        {
            const log = this.log.getComponent(cc.Label)
            log.string = message // + '\n' + log.string
            // console.log(message)
        }

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
                console.log(tune)
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
            Promise.all
            (
                [...midiUsed].map(midi => new Promise(resolve =>
                {
                    cc.loader.loadRes
                    (
                        'acoustic_grand_piano-mp3/' + midi,
                        cc.AudioClip,
                        (error, resource) => resolve(soundFont[midi] = resource),
                    )
                }))
            )
            .then(evt => this.Play({ muzikSequence, soundFont }))
        })
    },

    Play({ muzikSequence, soundFont })
    {
        const { unit, beat, pace } = muzikSequence
        const beatFactor = 60 * unit / (beat * pace)
        const beater = this.star.getComponent('Star')
        const beaterSequence = []
        const playSequence =
        [
            cc.callFunc(evt =>
            {
                this.partituur.x = PARTITUUR_OFFSET
                this.partituur.removeAllChildren()
                muzikSequence.forEach(({ callbacks }) => callbacks.forEach(callback => callback(cc.Color.BLACK)))
            })
        ]
        let laststamp = -(PARTITUUR_OFFSET - INDICATOR_OFFSET) / (FONT_WIDTH * SYMBOL_SCALE_FACTOR)
        console.log(soundFont)

        muzikSequence.forEach(({ timestamp, notes, callbacks }) =>
        {
            const duration = timestamp - laststamp
            beaterSequence.push(beater.Jump(duration * beatFactor))
            playSequence.push
            (
                cc.moveBy(duration * beatFactor, cc.v2(-duration * FONT_WIDTH * SYMBOL_SCALE_FACTOR, 0)),
                cc.callFunc(evt =>
                {
                    callbacks.forEach(callback => callback(cc.Color.YELLOW))
                    notes.forEach(({ notation }) =>
                    {
                        const id = cc.audioEngine.play(soundFont[notation], false, 1)
                        // this.scheduleOnce(dt => cc.audioEngine.pause(id), duration * 1000)
                    })
                }),
            )
            laststamp = timestamp
        })
        beaterSequence.push(beater.Jump(PARTITUUR_OFFSET * beatFactor / (FONT_WIDTH * SYMBOL_SCALE_FACTOR)))
        playSequence.push(cc.moveBy(PARTITUUR_OFFSET * beatFactor / (FONT_WIDTH * SYMBOL_SCALE_FACTOR), cc.v2(-PARTITUUR_OFFSET, 0)))

        this.star.active = true
        this.star.runAction(cc.repeatForever(cc.sequence(beaterSequence)))
        this.partituur.runAction(cc.repeatForever(cc.sequence(playSequence)))
    },
})
