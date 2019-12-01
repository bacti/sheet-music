cc.Class
({
    extends: cc.Component,
    properties:
    {
        playlist: { default: null, type: cc.Node },
        chanson: { default: null, type: cc.Prefab },
    },

    onLoad()
    {
        const { content: playlist } = this.node.getComponent(cc.ScrollView)
        cc.loader.loadResDir('abc', (error, assets) =>
        {
            if (error)
            {
                cc.error(error.toString())
                return
            }

            playlist.height = Math.ceil(assets.length / 5 ) * 330 + 400
            assets.forEach((asset, i) =>
            {
                const song = cc.instantiate(this.chanson)
                const title = song.getComponent('Song').title.getComponent(cc.Label)
                title.string = asset.name
                song.abctxt = asset._nativeAsset
                playlist.addChild(song)
            })
        })
        cc.debug.setDisplayStats(false)
    },
})
