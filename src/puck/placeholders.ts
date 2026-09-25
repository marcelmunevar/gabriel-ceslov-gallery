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

export const placeholderImages = {
  hero: svgDataUri("#2b2b2b", "#e8e2d8", "Gabriel Ceslov"),
  textAccent: svgDataUri("#3a3f3a", "#e8e2d8", "Studio"),
  featuredImage: svgDataUri("#4a4640", "#f2ede4", "Featured Work"),
  gallery1: svgDataUri("#5b4636", "#f2ede4", "Gallery I"),
  gallery2: svgDataUri("#3f4a52", "#f2ede4", "Gallery II"),
  gallery3: svgDataUri("#4d4038", "#f2ede4", "Gallery III"),
  gallery4: svgDataUri("#333d3a", "#f2ede4", "Gallery IV"),
  project1: svgDataUri("#2f2f2f", "#e8e2d8", "Project One"),
};
