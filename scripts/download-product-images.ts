import fs from 'fs';
import path from 'path';
import https from 'https';

// Product images from seed script
const productImages = {
  // MoskyAudio Products
  moskyAudio_bright_flame_amp_photo_0: "https://i.ibb.co/XZ1JKYfm/674fb86d9d8f5.jpg",
  moskyAudio_bright_flame_amp_photo_1: "https://i.ibb.co/4ZGqCZhb/674fb86d9b28a.jpg",
  moskyAudio_bright_flame_amp_photo_2: "https://i.ibb.co/8gkfXDt2/674fb86d9aa93.jpg", 
  moskyAudio_bright_flame_amp_photo_3: "https://i.ibb.co/qXDwZBw/674fb86d97495.jpg",
  moskyAudio_g_iii_blue_purple_photo_0: "https://i.ibb.co/B2x84PRc/667d0e69a626e.jpg",
  moskyAudio_overdrive_dolphin_photo_0: "https://i.ibb.co/KxdDJMGw/64632ad9ec563.jpg",
  moskyAudio_overdrive_dolphin_photo_1: "https://i.ibb.co/60fvZzf6/64632ad9eb555.jpg",
  moskyAudio_overdrive_dolphin_photo_2: "https://i.ibb.co/XfDtnBv7/64632ad9eb964.jpg",
  moskyAudio_overdrive_dolphin_photo_3: "https://i.ibb.co/kgXKzKvB/64632ad9ead27.jpg",
  moskyAudio_lm741_preamp_0: "https://i.ibb.co/TDhQ6VhS/64632fa74e960.jpg",
  moskyAudio_lm741_preamp_1: "https://i.ibb.co/wr3THDSf/646d744603bc2.jpg",
  moskyAudio_lm741_preamp_2: "https://i.ibb.co/3m3NffCC/646d7446044aa.jpg",
  moskyAudio_lm741_preamp_3: "https://i.ibb.co/WJ25xD0/646d744604dc2.jpg",
  moskyAudio_cosmic_blue: "https://i.ibb.co/m5bKVvVK/64632f712b227.jpg",
  moskyAudio_iso10_power_supply_0: "https://i.ibb.co/JWndDC9j/60da957db51c0.jpg",
  moskyAudio_iso10_power_supply_1: "https://i.ibb.co/mVF967tY/60da957db5a53.jpg",
  moskyAudio_iso10_power_supply_2: "https://i.ibb.co/cSzbTJq0/60da957db56c3.jpg",
  moskyAudio_sky_reverb_delay_0: "https://i.ibb.co/0RGvg21Z/5fe45bc5363dd.jpg",
  moskyAudio_sky_reverb_delay_1: "https://i.ibb.co/hFf5wVj1/5fe45bc536993.jpg",
  moskyAudio_sky_reverb_delay_2: "https://i.ibb.co/jkqsnBYB/5fe45bc53747f.jpg",
  moskyAudio_sol918_multi_effects_photo_0: "https://i.ibb.co/s9PBjFv2/60da9377a8597.jpg",
  moskyAudio_sol918_multi_effects_photo_1: "https://i.ibb.co/GQ9yyTnD/60da9377a7d6c.jpg",
  moskyAudio_sol918_multi_effects_photo_2: "https://i.ibb.co/hxBFwvFh/60da9377a766c.jpg",
  moskyAudio_blue_ocean_chorus_0: "https://i.ibb.co/QFYmn9Xf/60da8feaaaca0.jpg",
  moskyAudio_blue_ocean_chorus_1: "https://i.ibb.co/3Yrsgy5H/60da8feaab6fb.jpg",
  moskyAudio_blue_ocean_chorus_2: "https://i.ibb.co/HfTJKJ9W/60da8feaabf45.jpg",
  moskyAudio_mad_cow_0: "https://i.ibb.co/0ypv03vF/65f402af36bdd.jpg",
  moskyAudio_mad_cow_1: "https://i.ibb.co/JWtWCqL7/65faa0e789bb6.jpg",
  moskyAudio_mad_cow_2: "https://i.ibb.co/Q75Nt253/65faa0e7962c5.jpg",
  moskyAudio_mad_cow_3: "https://i.ibb.co/C5HPhKNj/65faa0e796d59.jpg",
  moskyAudio_effect_pedal_cable: "https://i.ibb.co/kgVHnnhr/581c4ce5297da.png",
  
  // M-VAVE Products
  mvave_mini_universe_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/10339783.jpg",
  mvave_mini_universe_photo_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/10339785.jpg",
  mvave_mini_universe_photo_2: "https://img.website.xin/contents/sitefiles3604/18022920/images/11019448.jpg",
  mvave_elemental_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/9719731.jpg",
  mvave_elemental_photo_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/9719728.jpg",
  mvave_elemental_photo_2: "https://img.website.xin/contents/sitefiles3604/18022920/images/9719730.jpg",
  mvave_annblackbox_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/10219104.jpg",
  mvave_annblackbox_photo_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/10219108.jpg",
  mvave_annblackbox_photo_2: "https://img.website.xin/contents/sitefiles3604/18022920/images/10219107.jpg",
  mvave_ir_box_phot_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/9720172.jpg",
  mvave_ir_box_phot_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/9720176.jpg",
  mvave_ir_box_phot_2: "https://img.website.xin/contents/sitefiles3604/18022920/images/9720173.jpg",
  mvave_baby_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/8570933.png",
  mvave_baby_photo_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/8570936.jpg",
  mvave_baby_photo_2: "https://img.website.xin/contents/sitefiles3604/18022920/images/8570935.jpg",
  mvave_chocolate_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/11350155.jpg",
  mvave_chocolate_photo_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/11350157.jpg",
  mvave_chocolate_photo_2: "https://img.website.xin/contents/sitefiles3604/18022920/images/11350158.jpg",
  mvave_tank_g_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/8376698.png",
  mvave_tank_g_photo_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/8376699.png",
  mvave_tank_g_photo_2: "https://img.website.xin/contents/sitefiles3604/18022920/images/8376700.png",
  mvave_tank_b_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/8376701.png",
  mvave_tank_b_photo_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/8376702.png",
  mvave_tank_b_photo_2: "https://img.website.xin/contents/sitefiles3604/18022920/images/8376700.png",
  mvave_pedal_power_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/8596626.png",
  mvave_wp_9_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/9720023.jpg",
  mvave_wp_9_photo_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/9720024.jpg",
  mvave_wp_9_photo_2: "https://img.website.xin/contents/sitefiles3604/18022920/images/9720025.jpg",
  mvave_wireless_in_ear_monitor_system: "https://img.website.xin/contents/sitefiles3604/18022920/images/10710519.jpg",
  mvave_wp_8_wireless_system: "https://img.website.xin/contents/sitefiles3604/18022920/images/8595897.jpg",
};

// Function to download an image
function downloadImage(url: string, filename: string, folder: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const filePath = path.join(folder, filename);
    const fileStream = fs.createWriteStream(filePath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${filename}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        console.log(`✅ Downloaded: ${filename}`);
        resolve();
      });
      
      fileStream.on('error', (error) => {
        reject(error);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

// Main function to download all images
async function downloadAllImages() {
  const baseFolder = path.join(__dirname, '..', 'public', 'product-images');
  
  console.log('🚀 Starting image download...');
  console.log(`📁 Base folder: ${baseFolder}`);
  
  for (const [key, url] of Object.entries(productImages)) {
    try {
      let folder: string;
      let filename: string;
      
      // Determine folder and filename based on key
      if (key.startsWith('moskyAudio_')) {
        folder = path.join(baseFolder, 'mosky-audio');
        filename = key.replace('moskyAudio_', '') + '.jpg';
      } else if (key.startsWith('mvave_')) {
        folder = path.join(baseFolder, 'm-vave');
        filename = key.replace('mvave_', '') + '.jpg';
      } else {
        folder = baseFolder;
        filename = key + '.jpg';
      }
      
      // Ensure folder exists
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
      }
      
      await downloadImage(url, filename, folder);
    } catch (error) {
      console.error(`❌ Failed to download ${key}:`, error);
    }
  }
  
  console.log('🎉 All downloads completed!');
}

// Run the download
downloadAllImages().catch(console.error);
