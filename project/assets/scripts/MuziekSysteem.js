import { BRACE, CLEFS, KEY, METER, BLANK, QUARTER_BLANK, SYSTEM_OFFSET, STAVE_OFFSET, STAVE_PADDING } from 'Constants'
import DrawBarline from 'DrawBarline'
import DrawStaffline from 'DrawStaffline'
import DrawMuzik from 'DrawMuzik'

cc.Class
({
    extends: cc.Component,
    properties:
    {
        muzik: { default: null, type: cc.Prefab },
        staffines: { default: null, type: cc.Node },
    },

    onLoad()
    {
        this.color = new cc.Color(0x7F, 0xFF, 0x7F)
    },

    DrawMuzikSystem({ id, clef, tune })
    {
        const offset = SYSTEM_OFFSET
        const lineHeight = (2 - id) * STAVE_PADDING
        const symbols =
        [
            QUARTER_BLANK,
            CLEFS[clef].symbol,
            KEY[clef][tune.key],
            METER[tune.pulse],
        ]
        DrawMuzik({ node: this.node, muzik: this.muzik, codes: symbols.join(''), color: this.color, offset, lineHeight })
    },

    Draw(tune)
    {
        const graphics = this.staffines.getComponent(cc.Graphics)
        for (let id in tune.voices)
        {
            this.DrawMuzikSystem({ id, clef: tune.voices[id].clef, tune })
            Array(5).fill().map((_, index) =>
            {
                DrawStaffline({ graphics, id, offset: SYSTEM_OFFSET, index, length: 1334 })
            })
        }
        DrawMuzik(Object.assign({ node: this.node, muzik: this.muzik, color: this.color }, BRACE))
        DrawBarline({ graphics, offset: SYSTEM_OFFSET })
    },
})
