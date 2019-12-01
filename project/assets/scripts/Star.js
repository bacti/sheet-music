const INVISIBLE_HEIGHT = 1024
const JUMP_HEIGHT = 50
cc.Class
({
    extends: cc.Component,

    onLoad()
    {
        this.node.active = false
    },

    Jump(time, sourcey, desty)
    {
        if (sourcey == undefined)
        {
            this.node.active = true
            this.node.y = INVISIBLE_HEIGHT
            return cc.sequence
            (
                cc.delayTime(time - 1),
                cc.callFunc(evt => (this.node.y = desty + JUMP_HEIGHT * 3)),
                cc.moveBy(1, cc.v2(0, JUMP_HEIGHT * -3)).easing(cc.easeCubicActionIn()),
            )
        }
        else
        if (desty == undefined)
        {
            return cc.sequence
            (
                cc.moveBy(0.5, cc.v2(0, JUMP_HEIGHT * 3)).easing(cc.easeCubicActionOut()),
                cc.callFunc(evt => (this.node.y = INVISIBLE_HEIGHT)),
                cc.delayTime(time - 0.5),
            )
        }
        else
        {
            const midway = Math.max(sourcey, desty) + JUMP_HEIGHT
            return cc.sequence
            (
                cc.moveBy(time / 2 , cc.v2(0, midway - sourcey)).easing(cc.easeCubicActionOut()),
                cc.moveBy(time / 2, cc.v2(0, desty - midway)).easing(cc.easeCubicActionIn()),
            )
        }
    },
})
