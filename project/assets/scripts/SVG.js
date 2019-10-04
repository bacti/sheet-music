import { path2curve } from 'R.curve'
import AbcNotation from 'AbcNotation'

cc.Class
({
    extends: cc.Component,
    properties:
    {
        muzik:
        {
            default: null,
            type: cc.Prefab,
        },
        muzikText:
        {
            default: null,
            type: cc.Prefab,
        },
    },

    onLoad()
    {
        cc.loader.loadRes('Game Of Thrones', (error, asset) => this.OnLoadingComplete(error, asset))
    },

    OnLoadingComplete(error, asset)
    {
        if (error)
            return cc.error(error.toString())

        AbcNotation.Parse(asset._nativeAsset).then(([svg, json]) =>
        {
            const { width, height } = json
            const graphics = this.node.getComponent(cc.Graphics)
            graphics.rect(0, 0, width, height)
            graphics.fillColor = new cc.Color(51, 51, 51, 255)
            graphics.fill()

            console.log(json)
            this.svgson = json
            this.color = new cc.Color(249, 206, 61)
            this.DrawElement(json, this.node)
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
                graphics.fillColor = this.color
                graphics.fill()
                graphics.strokeColor = this.color
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
                symbol.color = this.color
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

    update(dt)
    {
        if (!this.started)
            return
        this.node.x -= dt * 60
    },
})
