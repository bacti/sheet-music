import { TEMPO_MIN, TEMPO_MAX, TEMPO_WIDTH, TEMPO_HEIGHT } from 'Constants'
const TEMPO_MEAN = TEMPO_MIN + ~~((TEMPO_MAX - TEMPO_MIN) * 0.5)

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
        content.width = TEMPO_WIDTH * (TEMPO_MAX - TEMPO_MIN)
        scrollview.node.on('scroll-ended', evt => this.OnTempoChanged())

        this.tempoChanged = false
        this.touchLeft.on(cc.Node.EventType.TOUCH_START, _ => cc.OnTouchStart({ beater: this.hellokitty, hand: 2 }))
        this.touchRight.on(cc.Node.EventType.TOUCH_START, _ => cc.OnTouchStart({ beater: this.doraemon, hand: 1 }))

        ;[...Array(TEMPO_MAX - TEMPO_MIN)].map((evt, i) =>
        {
            const value = cc.instantiate(this.tempoValue)
            const text = value.getComponent(cc.Label)
            text.string = TEMPO_MIN + i
            content.addChild(value)
        })
    },

    MainMenu()
    {
        cc.director.loadScene('playlists')
    },

    PlayPause()
    {
        const { content } = this.tempo.getComponent(cc.ScrollView)
        const { partituur, doraemon, hellokitty, menu, tempo } = this
        const { muzikSequence } = partituur
        content.x = (TEMPO_MEAN - muzikSequence.pace) * TEMPO_WIDTH

        if (partituur.playing != false)
        {
            [partituur, doraemon, hellokitty].forEach(node => node.pauseAllActions())
            partituur.playing = false
            menu.runAction
            (
                cc.sequence
                (
                    cc.callFunc(evt => (tempo.active = true)),
                    cc.moveBy(0.3, cc.v2(0, -120)),
                )
            )
        }
        else
        {
            menu.runAction
            (
                cc.sequence
                (
                    cc.moveBy(0.3, cc.v2(0, 120)),
                    cc.callFunc(evt => (tempo.active = false)),
                )
            )

            if (this.tempoChanged)
            {
                [partituur, doraemon, hellokitty].forEach(node => node.stopAllActions())
                muzikSequence.Play()
                this.tempoChanged = false
            }
            else
            {
                [partituur, doraemon, hellokitty].forEach(node => node.resumeAllActions())
            }
            partituur.playing = true
        }
    },

    Replay()
    {
        this.tempoChanged = true
        this.PlayPause()
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
        muzikSequence.pace = Math.round(TEMPO_MEAN - content.x / TEMPO_WIDTH)
        content.stopAllActions()
        content.runAction(cc.moveTo(0.1, cc.v2((TEMPO_MEAN - muzikSequence.pace) * TEMPO_WIDTH, 0)))
        this.tempoChanged = true
    },
})
