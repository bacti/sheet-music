cc.Class
({
    extends: cc.Component,
    properties:
    {
        title: { default: null, type: cc.Node },
    },

    onLoad()
    {
        this.node.on(cc.Node.EventType.TOUCH_END, _ => this.OnPick())
    },

    OnPick()
    {
        const { abctxt } = this.node
        cc.GetABC = _ => abctxt
        cc.director.loadScene('game')
    },
})
