import googleFonts from './googleFonts.js';
import localFonts from './localFonts.js';
import {
	REGULAR,
	WEIGHTS,
	STRETCH_ORDER,
	ALL_FONTS_COLLECTION,
	SINGLE_VARIANT_COLLECTION,
	MULTIPLE_WEIGHTS_COLLECTION,
	MULTIPLE_STYLES_COLLECTION,
	STARRED_COLLECTION,
	UI_FONTS_COLLECTION,
	UNCATEGORIZED_COLLECTION,
} from './constants.js';

const allFonts = [...googleFonts, ...localFonts]
	.map(font => ({
		name: font.name,
		href: font.href,
		variants: [
			...font.weights.map(weight => ({
				weight: WEIGHTS[weight].value,
				name: WEIGHTS[weight].name,
				style: 'normal',
				stretch: 'normal',
			})),
			...(typeof font.italics === 'boolean' ? (font.italics ? font.weights : []) : font.italics).map(weight => ({
				weight: WEIGHTS[weight].value,
				name: [WEIGHTS[weight].name, 'italic'].filter(x => x).join(' '),
				style: 'italic',
				stretch: 'normal',
			})),
			...(font.stretches
				? Reflect.ownKeys(font.stretches).flatMap(weight => {
						const { values, italics } = font.stretches[weight];
						const variants = values.map(stretch => ({
							weight: WEIGHTS[weight].value,
							name: [WEIGHTS[weight].name, stretch].filter(x => x).join(' '),
							style: 'normal',
							stretch,
						}));
						return italics
							? [
									...variants,
									...variants.map(variant => ({
										...variant,
										name: [WEIGHTS[weight].name, italics ? 'italic' : '', variant.stretch].filter(x => x).join(' '),
										style: 'italic',
									})),
							  ]
							: variants;
				  })
				: []),
		]
			.map(variant => {
				const fontName = font.aliases?._font ?? font.name;
				const variantName = font.aliases?.[variant.name || '_regular'] ?? variant.name;
				return {
					...variant,
					name: [fontName, variantName].filter(x => x).join(' '),
				};
			})
			.sort(
				(a, b) =>
					a.weight -
					b.weight +
					((a.style === 'italic') - (b.style === 'italic')) * 10 +
					(STRETCH_ORDER.indexOf(a.stretch) - STRETCH_ORDER.indexOf(b.stretch))
			),
		show: true,
		marked: false,
		sizeOffset: 1,
		collections: font.collections ?? [],
		source: font,
	}))
	.sort((a, b) => a.name.localeCompare(b.name));

// TODO: Save these to a DB or something.
const STARRED_FONTS = ['Lexend', 'Atkinson Hyperlegible', 'Ovo', 'Trispace', 'Epilogue', 'Spectral', 'Manrope'];
const UI_FONTS = ['Helvetica', 'Default Sans', 'Output Sans 2 Beta', 'Inter'];

allFonts.forEach(font => {
	if (STARRED_FONTS.includes(font.name)) font.collections.push(STARRED_COLLECTION);
	if (UI_FONTS.includes(font.name)) font.collections.push(UI_FONTS_COLLECTION);
	if (font.variants.length === 1) font.collections.push(SINGLE_VARIANT_COLLECTION);
	else {
		if (font.source.weights.length > 1) font.collections.push(MULTIPLE_WEIGHTS_COLLECTION);
		if (font.source.italics) font.collections.push(MULTIPLE_STYLES_COLLECTION);
	}
	if (font.collections.length === 0) font.collections.push(UNCATEGORIZED_COLLECTION);
	font.collections.push(ALL_FONTS_COLLECTION);
});
allFonts.forEach(
	font =>
		(font.activeVariant = Math.max(
			0,
			font.variants.findIndex(
				variant =>
					variant.weight === WEIGHTS[REGULAR].value && variant.style === 'normal' && variant.stretch === 'normal'
			)
		))
);

export default allFonts;
