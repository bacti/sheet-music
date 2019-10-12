import { h, Component } from 'preact'
import { promise } from 'rim/preact-redux'
import { Data, Utils } from '../Utils'
import { XmlParser } from './xml2abc'

import AbcNotation from './AbcNotation'
import { Notes } from './Constants'
import './xmlplay'
window.$ = require('./jquery-3.3.1.slim.min')

var liggend = []
class XmlPlay extends Component
{
    Play(time, note, duration, voice, velocity)
    { // time and duration in millisecs
        // console.log(time, note, duration, voice, velocity)
        if (note == -1) return; // een rust
        var inst = note >> 7;
        // if (inst in instSf2Loaded)
        // {
        //     opneer (inst, note % 128, time / 1000, (duration - 1) / 1000, voice, velocity);  // msec -> sec
        // }
        // else
        {
            var midiMsg = [0x90, note, velocity]
            this.Zend(midiMsg, time, voice)
            midiMsg [2] = 0
            this.Zend(midiMsg, time + duration - 1, voice)
        }
    }
    
    Zend(midiMsg, tijd, vce)
    {
        var mtype = midiMsg [0] & 0xf0,
            velo = midiMsg [2],
            midiNum = midiMsg [1]
        tijd /= 1000;   // millisec -> sec
        if (mtype == 0x80) op (midiNum, tijd)
        if (mtype == 0x90)
        {
            if (velo > 0)
                this.Neer(midiNum, velo, tijd, vce)
            else
                this.Op(midiNum, tijd)
        }
    }
    
    Neer(midiNum, velo, time, vce)
    {
        const volCorJS = 0.5 / 32  // volume scaling factor for midiJS
        var vceVol = AbcNotation.midiVolume[vce] / 127
        var vcePan = (AbcNotation.midiPanning[vce] - 64) / 64, panNode
        var source = audioCtx.createBufferSource()
        source.buffer = this.sources[midiNum]

        var gainNode = audioCtx.createGain()
        gainNode.gain.setValueAtTime (0.00001, time) // begin bij -100 dB
        var vol = velo * vceVol * volCorJS
        if (vol == 0) vol = 0.00001;    // stem kan volume 0 hebben.
        gainNode.gain.exponentialRampToValueAtTime (vol, time + 0.001)
        if (hasPan) {
            panNode = audioCtx.createStereoPanner()
            panNode.pan.value = vcePan
        }
        source.connect (panNode || gainNode) // we doen de pan node voor de gain node!!
        if (panNode) panNode.connect (gainNode) // anders werkt de gain niet in FF
        gainNode.connect (audioCtx.destination) // verbind source met de sound kaart
        source.start(time)
        liggend [midiNum] = [source, gainNode, vol]
    }
    
    Op(midiNum, time)
    {
        var x = liggend [midiNum], source = x[0], g = x[1], velo = x[2]
        if (source)
        {
            g.gain.setValueAtTime(velo, time) // begin release at end of note
            g.gain.exponentialRampToValueAtTime(0.00001, time + 0.1) // -100 dB
            source.stop (time + 0.1)
            liggend [midiNum] = undefined
        }
    }
    
    Scan()
    {
        const t0 = audioCtx.currentTime * 1000
        const tfac = 60000 / 384
        let dt = 0, t1, tf

        while (dt == 0)
        {
            const nt = this.notesSequence[this.iSeq] // the current note
            // if (nt.tmp != curTemp) {
            //     curTemp = nt.tmp;
            //     // tmpElm.value = Math.round (curTemp * tempScale);
            // }
            tf = tfac / nt.tmp // abc time -> real time in msec
            if (this.iSeq == this.notesSequence.length - 1) // last note
            {
                this.iSeq = -1 // want straks +1
                dt = nt.ns[0].dur + 1000 // 1 second extra for repetition
            }
            else
            {
                t1 = this.notesSequence[this.iSeq + 1].t // abc time of next note
                dt = (t1 - nt.t) * tf // delta abc time * tf = delta real time in msec
            }
            // console.log(nt)
            nt.ns.forEach(noot =>
            {
                tf *= noot.dur <= 192 ? 1.3 /* legato effect for <= 1/8 */ : 1.1 /* less for > 1/8 */
                this.Play(t0, noot.mnum, noot.dur * tf, nt.vce, noot.velo) // play chord
            })
            this.iSeq += 1
        }
        setTimeout(evt => this.Scan(), dt)
    }

    componentDidMount()
    {
        window.abcElm = document.getElementById('notation')
        window.rolElm = document.getElementById('rollijn')

        const AudioContext = window.AudioContext || window.webkitAudioContext
        window.audioCtx = AudioContext && new AudioContext()

        // const options = { p: 'f', t: 1, u: 0, v: 3, m: 2, mnum: 0 }
        // const [ abctxt ] = XmlParser(Data[ALIAS_SHEET], options)
        // console.log(abctxt)
        // dolayout(abctxt)
        // dolayout(Data[ALIAS_SHEET])

        // AbcNotation.Parse(abctxt).then(info =>
        AbcNotation.Parse(Data[ALIAS_SHEET]).then(info =>
        {
            this.iSeq = 0
            this.notesSequence = info.notesSequence
            this.sources = info.sources
            this.Scan()
        })
    }

    render()
    {
        return (
            <xmlplay>
                <div class='scrollable' id='notation'></div>
            </xmlplay>
        )
    }
}
const asyncFunction = _ => Promise.all
([
    Utils.LoadFont(ALIAS_FONT_MUZIK, 'project/assets/font/abc2svg.ttf'),
    Utils.LoadFont(ALIAS_FONT_TEXT, 'project/assets/font/emilys-candy-regular.ttf'),
    // Utils.LoadXML(ALIAS_SHEET, 'data/musicxml/Sap Den Tet Roi.musicxml'),
    Utils.LoadText(ALIAS_SHEET, 'project/assets/resources/MuzioClementi_SonatinaOpus36No1_Part1.abc'),
])
export default promise(asyncFunction)(XmlPlay)