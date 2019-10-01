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

	ALIAS_SHEET: 'sonatina',
	ALIAS_FONT_MUZIK: 'music',
	ALIAS_FONT_TEXT: 'cookie',
}
