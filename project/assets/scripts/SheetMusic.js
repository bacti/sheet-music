import { path2curve } from 'R.curve'
import { Notes } from 'Constants'
import AbcNotation from 'AbcNotation'
import AudioRecorder from 'AudioRecorder'

cc.Class
({
    extends: cc.Component,
    properties:
    {
        star: { default: null, type: cc.Node },
        notes: { default: null, type: cc.Node },
        system: { default: null, type: cc.Node },
        log: { default: null, type: cc.Node },
        muzik: { default: null, type: cc.Prefab },
        muzikText: { default: null, type: cc.Prefab },
    },

    onLoad()
    {
        const deviceSize = cc.view.getVisibleSize()
        this.star.y = 480 - deviceSize.height / 2
        this.system.y -= deviceSize.height / 2
        this.node.y -= deviceSize.height / 2
        this.log.y = deviceSize.height / 2
        this.marker = {}
        this.soundFont = {}

        cc.Log = message =>
        {
            const log = this.log.getComponent(cc.Label)
            log.string = message + '\n' + log.string
            console.log(message)
        }

        AudioRecorder.CheckAuthorization('android.permission.RECORD_AUDIO')
        .then(authorised => AudioRecorder.PrepareRecording())
    
        //     // AudioRecorder.onProgress = (data) => {
        //     //   this.setState({currentTime: Math.floor(data.currentTime)});
        //     // };
    
        //     // AudioRecorder.onFinished = (data) => {
        //     //   // Android callback comes in the form of a promise instead.
        //     //   if (Platform.OS === 'ios') {
        //     //     this._finishRecording(data.status === "OK", data.audioFileURL, data.audioFileSize);
        //     //   }
        //     // };
        // //     resolve()
        // // }))
        .then(evt => new Promise((resolve, reject) => cc.loader.loadRes('Sap Den Tet Roi', (error, asset) =>
        {
            if (error)
            {
                cc.error(error.toString())
                return reject()
            }
            AbcNotation.Parse(asset._nativeAsset).then(([svgson, midiUsed, soundSequence]) =>
            {
                this.svgson = svgson
                this.soundSequence = soundSequence
                resolve(midiUsed)
            })
        })))
        .then(midiUsed => Promise.all
        (
            Object.keys(midiUsed).map(midi => new Promise(resolve =>
            {
                const ixm = midi % 128
                const note = Notes[ixm % 12] + (~~(ixm / 12) - 1)
                cc.loader.loadRes('acoustic_grand_piano-mp3/' + note, (error, asset) => resolve(this.soundFont[midi] = asset))
            }))
        ))
        .then(evt =>
        {
            const { system, notes } = this.svgson
            this.DrawElement(system, this.system, this.system)
            this.DrawElement(notes, this.notes, this.notes).then(evt => this.Play())
        })
    },

    Play()
    {
        const beater = this.star.getComponent('Star')
        const tfac = 60 / 384
        let sequence = Promise.resolve()
        let timestamp = -2
        let start = this.notes.x
        let destination
        this.star.active = true

        Promise.resolve()
        .then(evt => setTimeout(evt => AudioRecorder.StartRecording(), 3000))
        .then(evt => setTimeout(evt => AudioRecorder.StopRecording(), 20000))

        Object.keys(this.soundSequence).forEach((time, keyframe) =>
        {
            sequence = sequence
            .then(evt => new Promise(resolve =>
            {
                const sounds = this.soundSequence[time]
                const tf = tfac / sounds.tempo
                const now = time * tf
                destination = -Object.values(this.marker)[keyframe] + 200

                beater.Jump(now - timestamp, 10)
                this.notes.runAction(cc.sequence
                (
                    cc.moveBy(now - timestamp, cc.v2(destination - start, 0)),
                    cc.callFunc(evt =>
                    {
                        sounds.forEach(({ ns }) =>
                        {
                            ns.forEach(({ mnum, dur, velo }) =>
                            {
                                const duration = tf * (dur <= 192 ? 1.3 /* legato effect for <= 1/8 */ : 1.1 /* less for > 1/8 */)
                                const id = cc.audioEngine.play(this.soundFont[mnum], false, velo / 100)
                                // this.scheduleOnce(dt => cc.audioEngine.pause(id), duration * 1000)
                            })
                        })
                        timestamp = now
                        start = destination
                        resolve()
                    }, this.notes),
                ))
            }))
        })
        sequence.then(evt => new Promise(resolve =>
        {
            this.star.active = false
            this.notes.runAction(cc.sequence
            (
                cc.moveBy(2, cc.v2(-667, 0)),
                cc.callFunc(evt =>
                {
                    this.notes.x = 667
                    resolve()
                }, this.notes),
            ))
        }))
        .then(evt => this.Play())
    },

    DrawElement(info, node, root)
    {
        const graphics = root.getComponent(cc.Graphics)
        switch (info.type)
        {
            case 'path':
            {
                const { d } = info
                const style = this.svgson.style[info.class] || {}
                const { color = '#0000FF', strokeWidth = this.svgson.strokeWidth } = style
                const commands = path2curve(d)
                commands.forEach(([cmd, ...args]) =>
                {
                    switch (cmd)
                    {
                        case 'M' || 'm':
                        {
                            const [x, y] = args
                            return graphics.moveTo(node.x + x * node.scale, this.svgson.height - (node.y + y * node.scale))
                        }
                        case 'C' || 'c':
                        {
                            let curve = [...args]
                            for (let i = 0; i < 6; i += 2)
                            {
                                curve[i] = node.x + curve[i] * node.scale
                                curve[i + 1] = this.svgson.height - (node.y + curve[i + 1] * node.scale)
                            }
                            return graphics.bezierCurveTo(...curve)
                        }
                    }
                })
                graphics.lineWidth = Math.max(1, strokeWidth * node.scale * 1.5)
                graphics.fillColor = new cc.Color().fromHEX(color)
                graphics.fill()
                graphics.strokeColor = new cc.Color().fromHEX(color)
                graphics.stroke()
                break   
            }

            case 'note':
            case 'text':
            {
                const { value, anchor = node.anchor, x = 0, y = 0 } = info
                const style = this.svgson.style[info.class]
                const { color = '#0000FF', fontSize = 24, bold = false, italic = false, oblique = false } = style || {}

                const symbol = cc.instantiate(style ? this.muzikText : this.muzik)
                const text = symbol.getComponent(cc.Label)
                text.string = ' '
                text.fontSize = fontSize * node.scale
                text._isBold = bold
                text._isItalic = italic || oblique
                root.addChild(symbol)

                text.string = ` ${value} `
                text.lineHeight = symbol.height * 1.5
                symbol.x = node.x + x * node.scale
                symbol.y = this.svgson.height - (node.y + y * node.scale) + text.fontSize / 2 - symbol.height * 0.13
                anchor > 0 ? (symbol.anchorX = anchor) : (symbol.x -= symbol.width)
                symbol.color = new cc.Color().fromHEX(color)
                if (info.type == 'note')
                {
                    this.marker[~~((node.x + x * node.scale) / 24) * 24] = node.x + x * node.scale
                    // graphics.rect(node.x + x * node.scale, symbol.y, 5, 5)
                    // graphics.fillColor = new cc.Color(0, 2, 211)
                    // graphics.fill()
                }
                break
            }

            case 'svg':
            case 'g':
            {
                const { anchor = 0, translate, scale = 1, children } = info
                const subnode = new cc.Node()

                if (translate)
                {
                    subnode.x = translate.x * node.scale
                    subnode.y = translate.y * node.scale
                }
                subnode.anchor = anchor
                subnode.scale = node.scale * scale
                node.addChild(subnode)

                return Promise.all(children.map(child => this.DrawElement(child, subnode, root)))
            }
        }
        return Promise.resolve()
    },
})
