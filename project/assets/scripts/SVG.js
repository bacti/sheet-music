import { path2curve } from 'R.curve'
import { Notes } from 'Constants'
import AbcNotation from 'AbcNotation'

cc.Class
({
    extends: cc.Component,
    properties:
    {
        log: { default: null, type: cc.Node },
        muzik: { default: null, type: cc.Prefab },
        muzikText: { default: null, type: cc.Prefab },
    },

    onLoad()
    {
        const log = this.log.getComponent(cc.Label)
        log.string += 'bacti'
        this.soundFont = {}

        new Promise((resolve, reject) => cc.loader.loadRes('Game Of Thrones', (error, asset) =>
        {
            if (error)
            {
                cc.error(error.toString())
                return reject()
            }
            AbcNotation.Parse(asset._nativeAsset).then(([svgson, midiUsed, midiSequence]) =>
            {
                this.svgson = svgson
                this.midiSequence = midiSequence
                resolve(midiUsed)
            })
        }))
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
            // console.log(this.soundFont)
            // console.log(cc.audioEngine)
            console.log(this.midiSequence)
            this.DrawElement(this.svgson, this.node)
            this.started = true
        })
    },

    DrawElement(info, node)
    {
        const graphics = this.node.getComponent(cc.Graphics)

        switch (info.type)
        {
            // case 'rect':
            // {
            //     const { x, y, width, height, fill, stroke } = attributes
            //     graphics.lineWidth = attributes['stroke-width']
            //     graphics.rect(x - 667, y - 501, width, height)
            //     graphics.fillColor = new cc.Color(...fill)
            //     graphics.fill()
            //     graphics.strokeColor = new cc.Color(...stroke)
            //     graphics.stroke()
            //     break   
            // }

            case 'path':
            {
                const { d } = info
                const textStyle = this.svgson.style[info.class]
                const { strokeWidth = this.svgson.strokeWidth } = textStyle || {}
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
                graphics.lineWidth = Math.max(1, strokeWidth * node.scale)
                graphics.fillColor = this.node.color
                graphics.fill()
                graphics.strokeColor = this.node.color
                graphics.stroke()
                break   
            }

            case 'text':
            {
                const { value, x = 0, y = 0 } = info
                const textStyle = this.svgson.style[info.class]
                const { fontSize = 24, bold = false, italic = false, oblique = false } = textStyle || {}

                const symbol = cc.instantiate(textStyle ? this.muzikText : this.muzik)
                const text = symbol.getComponent(cc.Label)
                text.string = ' '
                text.fontSize = fontSize * node.scale
                text._isBold = bold
                text._isItalic = italic || oblique
                this.node.addChild(symbol)

                text.string = ` ${value} `
                text.lineHeight = symbol.height * 1.5
                symbol.x = node.x + x * node.scale - symbol.width
                symbol.y = this.svgson.height - (node.y + y * node.scale) + text.fontSize / 2 - symbol.height * 0.13
                symbol.color = this.node.color
                break
            }

            case 'svg':
            case 'g':
            {
                const { translate, scale = 1, children } = info
                const subnode = new cc.Node()
                if (translate)
                {
                    subnode.x = translate.x * node.scale
                    subnode.y = translate.y * node.scale
                }
                subnode.scale = node.scale * scale
                node.addChild(subnode)
                children.forEach(child => this.DrawElement(child, subnode))
                break
            }
        }
    },

    // update(dt)
    // {
    //     if (!this.started)
    //         return
    //     this.node.x -= dt * 60
    // },
})
