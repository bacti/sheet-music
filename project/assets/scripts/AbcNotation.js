import { Abc } from 'abc2svg'
import Constants,
{
	BAR,
	KEY,
	NOTE,
	REST,
	TEMPO,
    BLOCK,
    ACCTRANS,
    DYNTAB,
    SCALE_STEPS,
}
from 'Constants'

export default new class
{
    Parse(abctxt)
    {
        this.playbackTransposition = []
        this.midiInstrument = []
        this.midiVolume = []
        this.midiPanning = []

        return new Promise((resolve, reject) =>
        {
            const abc2svg = new Abc
            ({
                OnError: error => reject(error),
                OnLoad: (svg, json) => resolve([json, this.midiUsed, this.midiSequence]),
                GetAbcModel: (...args) => this.GetAbcModel(...args),
            })
            abc2svg.tosvg('abc2svg', abctxt)
        })
    }

    MakeNotesSequence()
    {
        this.midiSequence = []
        const barTimes = {}
        let repcnt = 1
        let offset = 0
        let repstart = 0
        let reptime = 0
        let volta = 0
        for (let i = 0; i < this.allNotes.length; ++i)
        {
            const note = this.allNotes[i]
            if (note.bt && note.v == 0)
            {
                if (note.t in barTimes && note.bt [0] == ':')
                    continue // repeat only 1 time (when repeating repeat)
                if (repcnt == 1 && note.bt [0] == ':' && note.t > reptime)
                {
                    i = repstart - 1
                    repcnt = 2
                    offset += note.t - reptime
                    continue
                }
                if (repcnt == 2 && note.bt [0] == ':' && note.t > reptime) { repcnt = 1; }
                if (repcnt == 1 && note.bt [note.bt.length - 1] == ':') { repstart = i; reptime = note.t; }
                if (volta && (n.tx || note.bt != '|')) { volta = 0; offset -= note.t - tvolta; }
                if (repcnt == 2 && note.tx == '1') { volta = 1; tvolta = n.t }
            };
            if (volta)
                continue
            if (note.bt)
            {
                barTimes[note.t] = 1
                continue
            } // measurement times for metronome
            this.midiSequence.push
            ({
                t: note.t + offset,
                // xy: ntsPos[note.ix],
                ns: note.ns,
                vce: note.v,
                inv: note.inv,
                tmp: note.tmp
            })
        }
    }

    ParseSequence(ts)
    {
        const noten = []
        switch (ts.type)
        {
            case TEMPO:
            {
                const dtmp = ts.tempo_notes.reduce((sum, x) => sum + x)
                this.tempo = ts.tempo * dtmp / 384
                if (ts.time == 0)
                    this.curTemp = this.tempo
                break
            }

            case REST:
            {
                const noot = { t: ts.time, mnum: -1, dur: ts.dur }
                noten.push(noot)
                this.allNotes.push({ t: ts.time, ix: ts.istart, v: ts.v, ns: noten, inv: ts.invis, tmp: this.tempo })
                break
            }

            case NOTE:
            {
                let instr = this.midiInstrument[ts.v] // from %%MIDI program instr
                if (ts.p_v.clef.clef_type == 'p')
                    instr += 128 // percussion
                for (let i = 0; i < ts.notes.length; ++i)
                {
                    const note = ts.notes[i]
                    let p = note.pit + 19 // C -> 35 == 5 * 7, global step
                    const v = ts.v // voice number 0..
                    const vid = ts.p_v.id // voice ID
                    if (ts.a_dd)
                    {
                        // check all deco's
                        ts.a_dd.forEach(r =>
                        {
                            const vol = DYNTAB[r.name] // volume of deco (if defined)
                            if (vol) // set all voices of staff to volume
                            {
                                this.staves[ts.st].forEach(vce =>
                                {
                                    this.vceVol[vce] = vol // array of current volumes
                                })
                            }
                        })
                    }
                    const vol = this.vceVol [v] || 60 // 60 == !p! if no volume
                    if (this.playbackTransposition[v])
                        p += this.playbackTransposition[v] // octave transposition in key
                    const oct = Math.floor(p / 7) // C -> 5
                    const step = p % 7 // C -> 0
                    if (note.acc != undefined)
                        this.alts[v][p] = ACCTRANS[note.acc] // change acctab for step p in voice ts.v
                    let mn = oct * 12 + SCALE_STEPS[step] + (p in this.alts[v] ? this.alts[v][p] : this.acctab[v][step])
                    const mapNm = ts.p_v.map
                    if (instr >= 128 && mapNm != 'MIDIdrum')
                    {
                        let nt = abctxt.substring (ts.istart, ts.iend)
                        nt = nt.match(/[=_^]*[A-Ga-g]/)[0]
                        const x = mapTab[mapNm + nt]
                        if (x)
                            mn = x
                    }
                    mn = instr * 128 + mn
                    this.midiUsed[mn] = 1 // collect all used midinumbers

                    const noot = { t: ts.time, mnum: mn, dur: ts.dur, velo: vol }
                    if (p in this.tied[v])
                    {
                        this.tied [v][p].dur += ts.dur // extension duration of previous note
                        if (note.ti1 == 0)
                            delete this.tied[v][p] // no further ties
                        continue // note is actually skipped
                    }
                    if (note.ti1 != 0)
                        this.tied[v][p] = noot // save ref to r to extend the duration later
                    noten.push(noot)
                }
                if (noten.length == 0) // no more notes left by ties
                    break
                this.allNotes.push({ t: ts.time, ix: ts.istart, v: ts.v, ns: noten, stf: ts.st, tmp: this.tempo })
                break
            }

            case KEY:
            {
                this.SetKey(ts.v, ts.k_sf) // set acctab to new key
                break
            }

            case BAR:
            {
                this.SetKey(ts.v, this.curKey[ts.v]) // reset acctab to current key
                this.allNotes.push({ t: ts.time, ix: ts.istart, v: ts.v, bt: ts.bar_type, tx: ts.text })
                break
            }

            case BLOCK:
            {
                ts.instr && (this.midiInstrument[ts.v] = ts.instr)
                ts.ctrl == 7 && (this.midiVolume[ts.v] = ts.val)
                ts.ctrl == 10 && (this.midiPanning[ts.v] = ts.val)
                break
            }
        }
        ts.ts_next && this.ParseSequence(ts.ts_next)
    }

    SetKey(index, sharpness)
    {
        const { KeySteps } = Constants
        const sign = sharpness >= 0
        const accs = sign ? KeySteps.slice(0, sharpness) : KeySteps.slice(sharpness) // steps modified by key
        this.acctab[index] = [0, 0, 0, 0, 0, 0, 0] // step modifications for the current key in voice v
        accs.forEach(iacc => (this.acctab[index][iacc] += sign ? 1 : -1)) // perform modification in acctab
        this.alts[index] = {}
        this.curKey[index] = sharpness
    }

    GetAbcModel(tsfirst, voices, musicTypes, info)
    {
        this.tied = {}
        this.acctab = {}
        this.alts = {}
        this.curKey = {}
        this.midiUsed = {}
        this.allNotes = []
        this.vceVol = []

        voices.forEach((voice, index) =>
        {
            this.SetKey(index, voice.key.k_sf)
            this.tied[index] = {}
        })

        this.staves = this.GetStaves(voices)
        this.ParseSequence(tsfirst)
        this.MakeNotesSequence()
    }

    GetStaves(voices)
    {
        const xs = []
        voices.forEach(({ v, clef, st, midictl, instr }) =>
        {
            xs[st] ? xs[st].push(v) : (xs[st] = [v])
            this.playbackTransposition[v] = clef.clef_octave || 0
            // stfHgt[v.st] = (v.stafflines || '|||||').length * 6 * (v.staffscale || 1)
            this.midiVolume[v] = (midictl && midictl[7]) || 100
            this.midiPanning[v] =(midictl && midictl[10]) || 64
            this.midiInstrument[v] = instr || 0
        })
        return xs
    }
}
