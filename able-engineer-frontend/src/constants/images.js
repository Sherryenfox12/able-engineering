// Placeholder images from the internet (Unsplash).
// Replace these URLs (or import local files from /src/assets) once real photos are ready.
const unsplash = (id, width = 1400) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=75`

const factoryPic = (file) => `/factory-picture/${encodeURIComponent(file)}`

export const FACTORY = {
  outside: factoryPic('factory outside.jpeg'),
  inside: factoryPic('factory inside.jpeg'),
  inside2: factoryPic('factory inside2.jpeg'),
  carpark: factoryPic('factory carpark.jpeg'),
  machine: factoryPic('machine.jpeg'),
  machine2: factoryPic('machine2.jpeg'),
  machine3: factoryPic('machine3.jpeg'),
  store: factoryPic('store.jpeg'),
  worker: factoryPic('worker.jpeg'),
  worker2: factoryPic('worker2.jpeg'),
  shop1: factoryPic('WhatsApp Image 2026-11-19 at 12.27.14.jpeg'),
  shop2: factoryPic('WhatsApp Image 2026-11-19 at 12.27.14 (1).jpeg'),
  shop3: factoryPic('WhatsApp Image 2026-11-19 at 12.27.15.jpeg'),
}

export const ABOUT_GALLERY = [
  FACTORY.outside,
  FACTORY.inside,
  FACTORY.inside2,
  FACTORY.carpark,
  FACTORY.machine,
  FACTORY.machine2,
  FACTORY.machine3,
  FACTORY.store,
  FACTORY.worker,
  FACTORY.worker2,
  FACTORY.shop1,
  FACTORY.shop2,
  FACTORY.shop3,
]

export const IMAGES = {
  heroBackground: unsplash('photo-1504917595217-d4dc5ebe6122', 1920),
  heroBrandsBackground: unsplash('photo-1565043589221-1a6fd9ae45c7', 1920),
  factory: FACTORY.inside,
  machinery: FACTORY.machine,
  machineParts: unsplash('photo-1537462715879-360eeb61a0ad'),
  technician: FACTORY.worker,
  engineer: FACTORY.worker2,
  industrial: FACTORY.outside,
}
