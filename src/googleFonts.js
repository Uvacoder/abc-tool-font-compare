import {
  WEIGHTS,
  WEIGHT_SYMBOLS,
  GOOGLE_FONTS_COLLECTION,
  TYPEWOLF_40_GOOGLE_FONTS_COLLECTION,
} from "./constants";
import responseJson from "./google_fonts_raw.json";

const TYPEWOLF_40_GOOGLE_FONTS = [
  "Alegreya",
  "Alegreya Sans",
  "Anonymous Pro",
  "Archivo Narrow",
  "BioRhyme",
  "Cabin",
  "Cardo",
  "Chivo",
  "Cormorant",
  "Crimson Text",
  "Eczar",
  "Fira Sans",
  "IBM Plex Sans",
  "Inconsolata",
  "Inknut Antiqua",
  "Inter",
  "Karla",
  "Lato",
  "Libre Baskerville",
  "Libre Franklin",
  "Lora",
  "Merriweather",
  "Montserrat",
  "Neuton",
  "Open Sans",
  "Playfair Display",
  "Poppins",
  "Proza Libre",
  "PT Sans",
  "PT Serif",
  "Raleway",
  "Roboto",
  "Roboto Slab",
  "Rubik",
  "Source Sans Pro",
  "Source Serif Pro",
  "Space Grotesk",
  "Space Mono",
  "Spectral",
  "Work Sans",
];

const googleFonts = responseJson.items.map((font) => {
  const [weights, italics] = font.variants.reduce(
    (acc, variant) => {
      const [_weights, _italics] = acc;
      if (variant === "regular") _weights.push(WEIGHT_SYMBOLS[400]);
      else if (variant === "italic") _italics.push(WEIGHT_SYMBOLS[400]);
      else {
        const [, _weight, _italic] = variant.match(/([0-9]+)(italic)?/);
        (_italic ? _italics : _weights).push(WEIGHT_SYMBOLS[_weight]);
      }
      return acc;
    },
    [[], []]
  );
  return {
    name: font.family,
    weights,
    italics,
    collections: [
      GOOGLE_FONTS_COLLECTION,
      ...(TYPEWOLF_40_GOOGLE_FONTS.includes(font.family)
        ? [TYPEWOLF_40_GOOGLE_FONTS_COLLECTION]
        : []),
    ],
    href: `https://fonts.googleapis.com/css2?family=${font.family.replace(
      / /g,
      "+"
    )}:ital,wght@${[weights, italics]
      .flatMap((arr, i) => arr.map((symbol) => `${i},${WEIGHTS[symbol].value}`))
      .join(";")}&display=block`,
  };
});

export default googleFonts;