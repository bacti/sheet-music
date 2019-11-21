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

    BLANK: '\u0061',
    QUARTER_BLANK: '\u0062',

    SYMBOL_SCALE_FACTOR: 1,
    BAR_OFFSET: 0,
    PARTITUUR_SAFE_OFFSET: 1334,
    INDICATOR_OFFSET: 450,
    SYSTEM_OFFSET: 50,
    STAVE_PADDING: 600,
    STAVE_OFFSET: [, 400, 100],
    STEM_OFFSET: [, 414, 114],
    FONT_SIZE: 150,
    FONT_WIDTH: 75,
    FONT_HEIGHT: 25,
    MAX_ATTEMPT: 20,
    TEMPO_MIN: 40,
    TEMPO_MAX: 161,
    TEMPO_HEIGHT: 75,

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
        return { id, notation, tone, duration, pitch }
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
