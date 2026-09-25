// Generates simple in-memory SVG placeholder images so the prototype needs no external assets.
const svgDataUri = (
  bg: string,
  fg: string,
  label: string,
  w = 1600,
  h = 900,
) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <rect width="100%" height="100%" fill="${bg}" />
    <text x="50%" y="50%" font-family="Georgia, serif" font-size="${Math.round(
      h / 12,
    )}" fill="${fg}" text-anchor="middle" dominant-baseline="middle">${label}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

// Photo-like gradient placeholder with no text, for images meant to look "real".
const gradientDataUri = (from: string, to: string, w = 1600, h = 900) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${from}" />
        <stop offset="100%" stop-color="${to}" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)" />
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

export const placeholderImages = {
  hero: gradientDataUri("#3a3630", "#0f0e0c"),
  textAccent: svgDataUri("#3a3f3a", "#e8e2d8", "Studio"),
  featuredImage: gradientDataUri("#5c5347", "#211d18"),
  gallery1: svgDataUri("#5b4636", "#f2ede4", "Gallery I"),
  gallery2: svgDataUri("#3f4a52", "#f2ede4", "Gallery II"),
  gallery3: svgDataUri("#4d4038", "#f2ede4", "Gallery III"),
  gallery4: svgDataUri("#333d3a", "#f2ede4", "Gallery IV"),
  project1: svgDataUri("#2f2f2f", "#e8e2d8", "Project One"),
};
