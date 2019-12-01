import { PARTITUUR_SAFE_OFFSET, INDICATOR_OFFSET, STAVE_PADDING, STAVE_OFFSET, SYMBOL_SCALE_FACTOR, FONT_WIDTH, FONT_HEIGHT, MAX_ATTEMPT } from 'Constants'
import AbcNotation from 'AbcNotation'
import AudioRecorder from 'AudioRecorder'
import Actions from 'SheetMusicActions'
import MidiListener from 'MidiListener'
import TapListener  from 'TapListener'

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
        // cc.NoteDetected = notations =>
        // {
        //     this.doraemon.disabled != true && this.CheckSound(notations, 1)
        //     this.hellokitty.disabled != true && this.CheckSound(notations, 2)
        // }

        const sheetmusic = this
        this.muzikTimer = {}
        MidiListener.Set({ sheetmusic })
        TapListener.Set({ sheetmusic })

        Promise.resolve()
        .then(evt => AudioRecorder.CheckAuthorization())
        .then(authorised => AudioRecorder.PrepareRecording())
        .then(evt => new Promise(resolve =>
        {
            AbcNotation.Parse(cc.GetABC()).then(tune =>
            {
                // console.log(tune)
                this.system.getComponent('MuziekSysteem').Draw(tune)
                this.partituur.getComponent('Partituur').Draw(tune)
                resolve()
            })
        }))
        .then(evt =>
        {
            const { muzikSequence, muzikLength } = this.partituur
            const soundFont = {}
            const midiUsed = new Set()
            muzikSequence.forEach(({ notes }) => notes.forEach(({ notation }) => midiUsed.add(notation)))
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
            muzikSequence.Play = _ => Actions.Play({ sheetmusic, muzikSequence, muzikLength, soundFont })
            // console.log(muzikSequence)
        })
    },

    GetCurrentMuzik({ hand, tolerance })
    {
        return this.muzikTimer[hand].find(({ timestamp }) => Math.abs(timestamp - this.muzikTimestamp) < tolerance)
    },

    // CheckSound(notations, id)
    // {
    //     const muzik = this.muzikTimer[id].find(({ timestamp }) => Math.abs(timestamp - this.muzikTimestamp) < 0.5)
    //     if (muzik == undefined)
    //         return
    //     const { handnotes, handcallbacks, color } = muzik
    //     handnotes.every(({ notation }) => notations.includes(notation))
    //         && handcallbacks.forEach(({ func }) => func(color))
    // },

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
