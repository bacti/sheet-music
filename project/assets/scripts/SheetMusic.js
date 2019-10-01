import { path2curve } from 'R.curve'
import AbcNotation from 'AbcNotation'

cc.Class
({
    extends: cc.Component,
    properties: {},

    onLoad()
    {
        cc.loader.loadRes('Game Of Thrones', (error, asset) => this.OnLoadingComplete(error, asset))
    },

    OnLoadingComplete(error, asset)
    {
        if (error)
            return cc.error(error.toString())
        this.started = true

        AbcNotation.Parse(asset._nativeAsset).then(([svg, json]) =>
        {
            const scheme = 'chiki'
            this.webview = this.node.getComponent(cc.WebView)
            // this.webview.url = `http://sa2wks0052.sai.gameloft.org:8001/`
            this.webview.url = `javascript:
            (
                document.write
                (' \
                    <style> \
                        html, body { \
                            position: fixed; \
                            overflow: hidden; \
                            width: 100%; \
                            height: 100%; \
                            left: 0px; \
                            top: 0px; \
                            padding: 0px; \
                            margin: 0px; \
                            transform: translateZ(0); \
                            -ms-content-zooming:none; \
                            background-color: #E91E63; \
                        } \
                    </style> \
                    <div style="background-color:#E91E63;height:100%">${svg.replace(/[\n]/g, '')}</div> \
                ')
            )`
            
            this.webview.setJavascriptInterfaceScheme(scheme)
            this.webview.setOnJSCallback((target, url) =>
            {
                console.log('bacti', target, url)
            })

            console.log(this)
            console.log(json.width, json.height)
            this.node.width = json.width * 750 / json.height
            this.node.height = 750
        })
    },

    // update(dt)
    // {
    //     if (!this.started)
    //         return
    //     // console.log('update', dt)
    //     this.node.x -= dt * 100
    // },
})
