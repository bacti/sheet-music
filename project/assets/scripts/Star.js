cc.Class
({
    extends: cc.Component,
    properties:
    {
    },

    onLoad()
    {
        this.node.active = false
    },

    Jump(time, height = 20)
    {
        return cc.sequence
        (
            cc.moveBy(time / 2 , cc.v2(0, height)).easing(cc.easeCubicActionOut()),
            cc.moveBy(time / 2, cc.v2(0, -height)).easing(cc.easeCubicActionIn()),
        )
    },
})
