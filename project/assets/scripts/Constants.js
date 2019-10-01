module.exports =
{
	BLEN: 1536,

	// symbol types
	BAR: 0,
	CLEF: 1,
	CUSTOS: 2,
	GRACE: 4,
	KEY: 5,
	METER: 6,
	MREST: 7,
	NOTE: 8,
	PART: 9,
	REST: 10,
	SPACE: 11,
	STAVES: 12,
	STBRK: 13,
	TEMPO: 14,
	BLOCK: 16,
	REMARK: 17,

	// note heads
	FULL: 0,
	EMPTY: 1,
	OVAL: 2,
	OVALBARS: 3,
	SQUARE: 4,

	// slur/tie types (3 + 1 bits)
	SL_ABOVE: 0x01,
	SL_BELOW: 0x02,
	SL_AUTO: 0x03,
	SL_HIDDEN: 0x04,
	SL_DOTTED: 0x08, // (modifier bit)

	// staff system
	OPEN_BRACE: 0x01,
	CLOSE_BRACE: 0x02,
	OPEN_BRACKET: 0x04,
	CLOSE_BRACKET: 0x08,
	OPEN_PARENTH: 0x10,
	CLOSE_PARENTH: 0x20,
	STOP_BAR: 0x40,
	FL_VOICE: 0x80,
	OPEN_BRACE2: 0x0100,
	CLOSE_BRACE2: 0x0200,
	OPEN_BRACKET2: 0x0400,
	CLOSE_BRACKET2: 0x0800,
	MASTER_VOICE: 0x1000,

	IN: 96, // resolution 96 PPI
	CM: 37.8, // 1 inch: 2.54 centimeter
    YSTEP: 256, /* number of steps for y offsets */

    Instruments:
    [
        'acoustic_grand_piano', 'bright_acoustic_piano', 'electric_grand_piano',
        'honkytonk_piano', 'electric_piano_1', 'electric_piano_2', 'harpsichord', 'clavinet', 'celesta',
        'glockenspiel', 'music_box', 'vibraphone', 'marimba', 'xylophone', 'tubular_bells', 'dulcimer',
        'drawbar_organ', 'percussive_organ', 'rock_organ', 'church_organ', 'reed_organ', 'accordion',
        'harmonica', 'tango_accordion', 'acoustic_guitar_nylon', 'acoustic_guitar_steel',
        'electric_guitar_jazz', 'electric_guitar_clean', 'electric_guitar_muted', 'overdriven_guitar',
        'distortion_guitar', 'guitar_harmonics', 'acoustic_bass', 'electric_bass_finger', 
        'electric_bass_pick', 'fretless_bass', 'slap_bass_1', 'slap_bass_2', 'synth_bass_1',
        'synth_bass_2', 'violin', 'viola', 'cello', 'contrabass', 'tremolo_strings', 'pizzicato_strings',
        'orchestral_harp', 'timpani', 'string_ensemble_1', 'string_ensemble_2', 'synth_strings_1',
        'synth_strings_2', 'choir_aahs', 'voice_oohs', 'synth_choir', 'orchestra_hit', 'trumpet',
        'trombone', 'tuba', 'muted_trumpet', 'french_horn', 'brass_section', 'synth_brass_1',
        'synth_brass_2', 'soprano_sax', 'alto_sax', 'tenor_sax', 'baritone_sax', 'oboe', 'english_horn',
        'bassoon', 'clarinet', 'piccolo', 'flute', 'recorder', 'pan_flute', 'blown_bottle', 'shakuhachi',
        'whistle', 'ocarina', 'lead_1_square', 'lead_2_sawtooth', 'lead_3_calliope', 'lead_4_chiff',
        'lead_5_charang', 'lead_6_voice', 'lead_7_fifths', 'lead_8_bass__lead', 'pad_1_new_age',
        'pad_2_warm', 'pad_3_polysynth', 'pad_4_choir', 'pad_5_bowed', 'pad_6_metallic', 'pad_7_halo',
        'pad_8_sweep', 'fx_1_rain', 'fx_2_soundtrack', 'fx_3_crystal', 'fx_4_atmosphere',
        'fx_5_brightness', 'fx_6_goblins', 'fx_7_echoes', 'fx_8_scifi', 'sitar', 'banjo', 'shamisen',
        'koto', 'kalimba', 'bagpipe', 'fiddle', 'shanai', 'tinkle_bell', 'agogo', 'steel_drums',
        'woodblock', 'taiko_drum', 'melodic_tom', 'synth_drum', 'reverse_cymbal', 'guitar_fret_noise',
        'breath_noise', 'seashore', 'bird_tweet', 'telephone_ring', 'helicopter', 'applause','gunshot'
    ],
    KeySteps: [3, 0, 4, 1, 5, 2, 6], // step values of the cycle of fifth
    SCALE_STEPS: [0, 2, 4, 5, 7, 9, 11], // step values of the scale of C
    ACCTRANS: { '-2': -2, '-1': -1, 0: 0, 1: 1, 2: 2, 3: 0 },
    diamap: '0,1-,1,1+,2,3,3,4,4,5,6,6+,7,8-,8,8+,9,10,10,11,11,12,13,13+,14',
    DYNTAB: { ppp: 30, pp: 45, p: 60, mp: 75, mf: 90, f: 105, ff: 120, fff: 127 },
    Kleur: [ '#f9f', '#3cf', '#c99', '#f66', '#fc0', '#cc0', '#ccc' ],
    Notes: 'C Db D Eb E F Gb G Ab A Bb B'.split(' '),
}
