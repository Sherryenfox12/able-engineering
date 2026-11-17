// Placeholder images from the internet (Unsplash).
// Replace these URLs (or import local files from /src/assets) once real photos are ready.
const unsplash = (id, width = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=75`

export const IMAGES = {
  heroBackground: unsplash('photo-1504917595217-d4dc5ebe6122', 1920),
  factory: 'https://prototool.com/wp-content/uploads/2023/04/Types-of-CNC-machines-1024x576.webp',
  machinery: unsplash('photo-1581092335397-9583eb92d232'),
  machineParts: unsplash('photo-1537462715879-360eeb61a0ad'),
  technician: unsplash('photo-1558618666-fcd25c85cd64'),
  engineer: unsplash('photo-1581091226825-a6a2a5aee158'),
  industrial: unsplash('photo-1513828583688-c52646db42da'),
}
