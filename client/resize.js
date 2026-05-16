import { Jimp } from 'jimp';

async function resizeIcons() {
  console.log('Resizing PWA icons...');
  const image = await Jimp.read('C:/Users/Admin/Desktop/Gemini_Generated_Image_dwsr0qdwsr0qdwsr.png');
  
  // Create 192x192
  const img192 = image.clone();
  img192.resize(192, 192);
  await img192.writeAsync('./public/icon-192.png');
  console.log('Saved icon-192.png');

  // Create 512x512
  const img512 = image.clone();
  img512.resize(512, 512);
  await img512.writeAsync('./public/icon-512.png');
  console.log('Saved icon-512.png');
}

resizeIcons().catch(console.error);
