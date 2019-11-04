import Constants, { KEY_DEF } from 'Constants'
export default new class
{
    GetParam(txt, param)
    {
        const check = txt.match(new RegExp(`${param}:(.+)`))
        return check && check[1]
    }

    GetUnitLength(txt)
    {
        return ~~(this.GetParam(txt, 'L') || '0').match(/\d+$/)[0]
    }

    GetTempo(txt)
    {
        const tempo = this.GetParam(txt, 'Q')
        const [beat, pace] = tempo.split('=')
        return [1 / ~~beat.match(/\d+$/)[0], ~~pace]
    }

    GetVoices()
    {
        const { key, unit, voices } = this.tune
        const { accidental, keySet } = KEY_DEF[key] || {}
        this.abctxt.replace(/V:(\d+)[\x20]+(\w+)\s+([^V]*)/g, (_, id, clef, txt) =>
        {
            const unitLength = this.GetUnitLength(txt)
            let raw = this.abctxt.match(new RegExp(`V:${id}\r([^V]+)`))[1].replace(/%\d+/g, '').trim()
            accidental && keySet.forEach(note => (raw = raw.replace(new RegExp(`${note}`, 'g'), accidental + note)))
            voices[id] = { clef, raw, unit: unitLength == 0 ? unit : 1 / unitLength }
            this.tune.unit = Math.min(this.tune.unit, voices[id].unit)
        })
    }

    GetConstants()
    {
        this.abctxt.replace(/%%(\w+)\s+([0-9\.\-]+)/g, (match, key, value) => (Constants[key] = +value))
    }

    Parse(abctxt)
    {
        this.abctxt = abctxt.replace(/\/(?!\d)/g, '/2')
        const [beat, pace] = this.GetTempo(this.abctxt)
        this.tune =
        {
            index: this.GetParam(this.abctxt, 'X'),
            title: this.GetParam(this.abctxt, 'T'),
            composer: this.GetParam(this.abctxt, 'C'),
            meter: this.GetParam(this.abctxt, 'M'),
            unit: 1 / this.GetUnitLength(this.abctxt),
            tempo: this.GetParam(this.abctxt, 'Q'),
            key: this.GetParam(this.abctxt, 'K'),
            beat,
            pace,
            voices: {},
        }
        this.GetConstants()
        this.GetVoices()
        return new Promise(resolve => resolve(this.tune))
    }
}
