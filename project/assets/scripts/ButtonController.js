import { TEMPO_MIN, TEMPO_MAX, TEMPO_HEIGHT } from 'Constants'
cc.Class
({
    extends: cc.Component,
    properties:
    {
        menu: { default: null, type: cc.Node },
        partituur: { default: null, type: cc.Node },
        doraemon: { default: null, type: cc.Node },
        hellokitty: { default: null, type: cc.Node },
        metronome: { default: null, type: cc.Node },
        leftHand: { default: null, type: cc.Node },
        rightHand: { default: null, type: cc.Node },
        mobile: { default: null, type: cc.Node },
        keyboard: { default: null, type: cc.Node },
        playback: { default: null, type: cc.Node },
        touchLeft: { default: null, type: cc.Node },
        touchRight: { default: null, type: cc.Node },
        tempo: { default: null, type: cc.Node },
        tempoValue: { default: null, type: cc.Prefab },
    },

    onLoad()
    {
        const scrollview = this.tempo.getComponent(cc.ScrollView)
        const { content } = scrollview
        content.height = TEMPO_HEIGHT * (TEMPO_MAX - TEMPO_MIN)
        scrollview.node.on('scroll-ended', evt => this.OnTempoChanged())
        this.touchLeft.on(cc.Node.EventType.TOUCH_START, event => this.PlayMuzik(2))
        this.touchRight.on(cc.Node.EventType.TOUCH_START, event => this.PlayMuzik(1))

        ;[...Array(TEMPO_MAX - TEMPO_MIN)].map((evt, i) =>
        {
            const value = cc.instantiate(this.tempoValue)
            const text = value.getComponent(cc.Label)
            text.string = TEMPO_MIN + i
            content.addChild(value)
        })
    },

    PlayPause()
    {
        const { content } = this.tempo.getComponent(cc.ScrollView)
        const { muzikSequence } = this.partituur
        content.y = (muzikSequence.pace - TEMPO_MIN + 0.5) * TEMPO_HEIGHT

        if (this.partituur.playing != false)
        {
            this.menu.runAction
            (
                cc.sequence
                (
                    cc.callFunc(evt => (this.tempo.active = true)),
                    cc.moveBy(0.3, cc.v2(0, -120)),
                )
            )
            this.doraemon.pauseAllActions()
            this.hellokitty.pauseAllActions()
            this.partituur.pauseAllActions()
            this.partituur.playing = false
        }
        else
        {
            this.menu.runAction
            (
                cc.sequence
                (
                    cc.moveBy(0.3, cc.v2(0, 120)),
                    cc.callFunc(evt => (this.tempo.active = false)),
                )
            )
            this.doraemon.resumeAllActions()
            this.hellokitty.resumeAllActions()
            this.partituur.resumeAllActions()
            this.partituur.playing = true
        }
    },

    MetronomeToggle()
    {
        const toggle = this.metronome.getComponent(cc.Toggle)
        this.partituur.metronome = !toggle.isChecked
    },

    PlaybackToggle()
    {
        const toggle = this.playback.getComponent(cc.Toggle)
        this.partituur.playback = !toggle.isChecked
    },

    PlayMuzik(id)
    {
        cc.MuzikTapped(id)
    },

    HandLeftToggle()
    {
        const toggle = this.leftHand.getComponent(cc.Toggle)
        this.hellokitty.disabled = toggle.isChecked
        this.hellokitty.opacity = ~~(!toggle.isChecked) * 255
        this.EnsureNoHandFree()
    },

    HandRightToggle()
    {
        const toggle = this.rightHand.getComponent(cc.Toggle)
        this.doraemon.disabled = toggle.isChecked
        this.doraemon.opacity = ~~(!toggle.isChecked) * 255
        this.EnsureNoHandFree()
    },

    EnsureNoHandFree()
    {
        if (this.hellokitty.disabled && this.doraemon.disabled)
        {
            this.leftHand.getComponent(cc.Toggle).isChecked = false
            this.HandLeftToggle()
            this.rightHand.getComponent(cc.Toggle).isChecked = false
            this.HandRightToggle()
        }
    },

    OnModeChanged(event, mode)
    {
        switch (mode)
        {
            case 'mobile':
            {
                this.mobile.active = false
                this.keyboard.active = true
                this.touchLeft.active = false
                this.touchRight.active = false
                break
            }

            case 'keyboard':
            {
                this.keyboard.active = false
                this.playback.active = true
                this.partituur.playback = true
                break
            }

            case 'playback':
            {
                this.mobile.active = true
                this.playback.active = false
                this.partituur.playback = false
                this.touchLeft.active = true
                this.touchRight.active = true
                break
            }
        }
    },

    OnTempoChanged()
    {
        const { content } = this.tempo.getComponent(cc.ScrollView)
        const { muzikSequence } = this.partituur
        const lasty = content.y
        const dtempo = ~~(lasty / TEMPO_HEIGHT)
        muzikSequence.pace = TEMPO_MIN + dtempo
        content.stopAllActions()
        content.runAction(cc.moveBy(0.5, cc.v2(0, (dtempo + 0.5) * TEMPO_HEIGHT - lasty)))

        this.partituur.stopAllActions()
        this.doraemon.stopAllActions()
        this.hellokitty.stopAllActions()
        muzikSequence.Play()
        this.partituur.pauseAllActions()
        this.doraemon.pauseAllActions()
        this.hellokitty.pauseAllActions()
    },
})
