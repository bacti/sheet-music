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
            METER[tune.meter],
        ]
        DrawMuzik({ node: this.node, muzik: this.muzik, codes: symbols.join(''), offset, lineHeight })
    },

    Draw(tune)
    {
        const graphics = this.node.getComponent(cc.Graphics)
        for (let id in tune.voices)
        {
            this.DrawMuzikSystem({ id, clef: tune.voices[id].clef, tune })
            Array(5).fill().map((_, index) => DrawStaffline({ graphics, id, offset: SYSTEM_OFFSET, index, length: 1500 }))
        }
        DrawMuzik(Object.assign({ node: this.node, muzik: this.muzik }, BRACE))
        DrawBarline({ graphics, offset: SYSTEM_OFFSET })
    },
})
