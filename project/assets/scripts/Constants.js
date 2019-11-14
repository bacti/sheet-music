const Constants =
{
    SEMIBREVE: 1,
    MINIM: 0.5,
    CROTCHET: 0.25,
    QUAVER: 0.125,
    SEMIQUAVER: 0.0625,
    NOTATION:
    {
        treble:
        {
            octave: 4,
            tone: 3,
            '0'  : 'C',
            '0.5': 'Db',
            '1'  : 'D',
            '1.5': 'Eb',
            '2'  : 'E',
            '3'   : 'F',
            '3.5' : 'Gb',
            '4'   : 'G',
            '4.5' : 'Ab',
            '5'   : 'A',
            '5.5' : 'Bb',
            '6'   : 'B',
        },
        bass:
        {
            octave: 3,
            tone: -2,
            '0'  : 'C',
            '0.5': 'Db',
            '1'  : 'D',
            '1.5': 'Eb',
            '2'  : 'E',
            '3'   : 'F',
            '3.5' : 'Gb',
            '4'   : 'G',
            '4.5' : 'Ab',
            '5'   : 'A',
            '5.5' : 'Bb',
            '6'   : 'B',
        },
    },
    CLEFS:
    {
        treble:
        {
            symbol: '\u0059',
            C: { pitch: -3 },
            D: { pitch: -2 },
            E: { pitch: -1 },
            F: { pitch: 0 },
            G: { pitch: 1 },
            A: { pitch: 2 },
            B: { pitch: 3 },
        },
        bass:
        {
            symbol: '\u005A',
            C: { pitch: 9 },
            D: { pitch: 10 },
            E: { pitch: 11 },
            F: { pitch: 12 },
            G: { pitch: 13 },
            A: { pitch: 14 },
            B: { pitch: 15 },
        },
    },
    KEY_DEF:
    {
        F: { accidental: '-', keySet: ['B'] },
        Bb: { accidental: '-', keySet: ['B', 'E'] },
        Eb: { accidental: '-', keySet: ['A', 'B', 'E'] },
    },
    KEY:
    {
        treble:
        {
            F: '\u0063',
            Bb: '\u0064',
            Eb: '\u0065',
            G: '\u006B',
        },
        bass:
        {
            F: '\u003B',
            Bb: '\u003C',
            Eb: '\u003D',
            G: '\u005B',
        },
    },
    METER:
    {
        '4/4': '\u0071',
        '3/4': '\u0072',
        '2/4': '\u0073',
        '6/8': '\u0074',
        '12/8': '\u0075',
    },
    REST:
    {
        1: '\u004A',
        0.5: '\u0048',
        0.25: '\u0046',
        0.125: '\u0045',
        0.0625: '\u0044',
    },
    DOTTED:
    {
        0.5: '\u0043',
    },
    BRACE:
    {
        codes: '\u004C',
        offset: 10,
        lineHeight: 520,
        fontSize: 350,
    },
    OCTAVE:
    {
        "'": 7,
        ',': -7,
    },
    FLAG_UP:
    {
        QUAVER: '\u004F',
        SEMIQUAVER: '\u0051',
        OFFSET: 49,
        LINE_SHIFT: 64,
    },
    FLAG_DOWN:
    {
        QUAVER: '\u0050',
        SEMIQUAVER: '\u0052',
        OFFSET: 22,
        LINE_SHIFT: -150,
    },
    FREQUENCY:
    {
        C1: 16, C2: 33, C3: 65, C4: 131, C5: 262, C6: 523, C7: 1047, C8: 2093, C9: 4186,
        Db1: 17, Db2: 35, Db3: 69, Db4: 139, Db5: 278, Db6: 554, Db7: 1109, Db8: 2218, Db9: 4435,
        D1: 18, D2: 37, D3: 73, D4: 147, D5: 294, D6: 587, D7: 1175, D8: 2349,
        Eb1: 20, Eb2: 39, Eb3: 78, Eb4: 156, Eb5: 311, Eb6: 622, Eb7: 1245, Eb8: 2489,
        E1: 21, E2: 41, E3: 82, E4: 165, E5: 330, E6: 659, E7: 1319, E8: 2637,
        F1: 22, F2: 44, F3: 87, F4: 175, F5: 349, F6: 699, F7: 1397, F8: 2794,
        Gb1: 23, Gb2: 46, Gb3: 93, Gb4: 185, Gb5: 370, Gb6: 740, Gb7: 1475, Gb8: 2960,
        G1: 25, G2: 49, G3: 98, G4: 196, G5: 392, G6: 784, G7: 1568, G8: 3136,
        Ab1: 26, Ab2: 52, Ab3: 104, Ab4: 208, Ab5: 415, Ab6: 831, Ab7: 1661, Ab8: 3322,
        A1: 28, A2: 55, A3: 110, A4: 220, A5: 440, A6: 880, A7: 1760, A8: 3520, A9: 7040,
        Bb1: 29, Bb2: 58, Bb3: 117, Bb4: 233, Bb5: 466, Bb6: 932, Bb7: 1865, Bb8: 3729, Bb9: 7459,
        B1: 31, B2: 62, B3: 124, B4: 247, B5: 494, B6: 988, B7: 1976, B8: 3951, B9: 7902,
    },

    BLANK: '\u0061',
    QUARTER_BLANK: '\u0062',

    SYMBOL_SCALE_FACTOR: 1,
    BAR_OFFSET: 0,
    PARTITUUR_OFFSET: 1024,
    INDICATOR_OFFSET: 200,
    SYSTEM_OFFSET: 50,
    STAVE_PADDING: 600,
    STAVE_OFFSET: [, 368, 68],
    STEM_OFFSET: [, 382, 82],
    FONT_SIZE: 150,
    FONT_WIDTH: 75,
    FONT_HEIGHT: 25,

    GetNotation: ({ id, accidental, pitch, clef, duration }) =>
    {
        const NOTATION = Constants.NOTATION[clef]
        let tone = pitch + NOTATION.tone
        switch (accidental)
        {
            case '-':
            case '_':
                tone -= 0.5; break
            case '=':
                tone += 0; break
            case '+':
            case '^':
                tone += 0.5; break
        }

        const octaveOffset = Math.floor(tone / 7)
        const notation = NOTATION[tone - 7 * octaveOffset] + (NOTATION.octave + octaveOffset)
        return { id, notation, tone, duration }
    },

    GetNote: duration =>
    {
        const symbols = []
        switch (duration)
        {
            case 1: // semibreve
                symbols.push('\u004B')
            break
            case 0.5: // minim
                symbols.push('\u0049')
            break
            case 0.25: // crotchet
            case 0.125: // quaver
            case 0.0625: // semiquaver
                symbols.push('\u0047')
            break
        }
        return symbols
    },

    GetFlag: ({ up, duration, offset, lineHeight }) =>
    {
        const FLAG = up ? Constants.FLAG_UP : Constants.FLAG_DOWN
        const symbol = { offset: offset + FLAG.OFFSET, lineHeight: lineHeight + FLAG.LINE_SHIFT }
        switch (duration)
        {
            case 0.125: // quaver
                symbol.codes = FLAG.QUAVER
            break
            case 0.0625: // semiquaver
                symbol.codes = FLAG.SEMIQUAVER
            break
        }
        return symbol
    },

    GetDynamic: ({ dynamic, offset, lineHeight }) =>
    {
        const symbol = { offset, lineHeight }
        switch (dynamic)
        {
            case 'pppp':
                symbol.codes = '\u0025'
                symbol.offset -= Constants.FONT_WIDTH / 2
            break
            case 'ppp':
                symbol.codes = '\u0026'
                symbol.offset -= Constants.FONT_WIDTH / 2
            break
            case 'pp': symbol.codes = '\u0027'; break
            case 'p': symbol.codes = '\u0038'; break
            case 'mp': symbol.codes = '\u0028'; break
            case 'mf': symbol.codes = '\u0029'; break
            case 'f': symbol.codes = '\u0021'; break
            case 'm': symbol.codes = '\u0039'; break
            case 's': symbol.codes = '\u0022'; break
            case 'z': symbol.codes = '\u0023'; break
        }
        return symbol
    },

    GetRestDotted: (fraction, length, offset, lineHeight) =>
    {
        const symbol = { offset, lineHeight }
        switch (fraction)
        {
            case 0.5: symbol.codes = length == 1 ? '\u0042' : '\u0041'; break
        }
        return symbol
    },

    GetAccidental: ({ accidental, offset, lineHeight }) =>
    {
        const symbol = { offset, lineHeight }
        switch (accidental)
        {
            case '_': symbol.codes = '\u0056'; break
            case '=': symbol.codes = '\u0057'; break
            case '^': symbol.codes = '\u0058'; break
        }
        return symbol
    },
}
module.exports = Constants
