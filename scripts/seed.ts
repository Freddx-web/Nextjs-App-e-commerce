import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Product images organized by category
const productImages = {
  /**
   * MoskyAudio Products
   */
  // Imagenes del Bright Flame Amp
  moskyAudio_bright_flame_amp_photo_0: "https://i.ibb.co/XZ1JKYfm/674fb86d9d8f5.jpg",
  moskyAudio_bright_flame_amp_photo_1: "https://i.ibb.co/4ZGqCZhb/674fb86d9b28a.jpg",
  moskyAudio_bright_flame_amp_photo_2: "https://i.ibb.co/8gkfXDt2/674fb86d9aa93.jpg", 
  moskyAudio_bright_flame_amp_photo_3: "https://i.ibb.co/qXDwZBw/674fb86d97495.jpg",

  // Imagenes del G III blue purple
  moskyAudio_g_iii_blue_purple_photo_0: "https://i.ibb.co/B2x84PRc/667d0e69a626e.jpg",
  // Imagenes del overdrive dolphin
  moskyAudio_overdrive_dolphin_photo_0: "https://i.ibb.co/KxdDJMGw/64632ad9ec563.jpg",
  moskyAudio_overdrive_dolphin_photo_1: "https://i.ibb.co/60fvZzf6/64632ad9eb555.jpg",
  moskyAudio_overdrive_dolphin_photo_2: "https://i.ibb.co/XfDtnBv7/64632ad9eb964.jpg",
  moskyAudio_overdrive_dolphin_photo_3: "https://i.ibb.co/kgXKzKvB/64632ad9ead27.jpg",
  /// Imagenes del lm741 preamp
  moskyAudio_lm741_preamp_0: "https://i.ibb.co/TDhQ6VhS/64632fa74e960.jpg",
  moskyAudio_lm741_preamp_1: "https://i.ibb.co/wr3THDSf/646d744603bc2.jpg",
  moskyAudio_lm741_preamp_2: "https://i.ibb.co/3m3NffCC/646d7446044aa.jpg",
  moskyAudio_lm741_preamp_3: "https://i.ibb.co/WJ25xD0/646d744604dc2.jpg",
  // Imagenes del cosmic blue
  moskyAudio_cosmic_blue: "https://i.ibb.co/m5bKVvVK/64632f712b227.jpg",
  // Imagenes del iso10 power supply
  moskyAudio_iso10_power_supply_0: "https://i.ibb.co/JWndDC9j/60da957db51c0.jpg",
  moskyAudio_iso10_power_supply_1: "https://i.ibb.co/mVF967tY/60da957db5a53.jpg",
  moskyAudio_iso10_power_supply_2: "https://i.ibb.co/cSzbTJq0/60da957db56c3.jpg",

  // Imagenes del sky reverb delay
  moskyAudio_sky_reverb_delay_0: "https://i.ibb.co/0RGvg21Z/5fe45bc5363dd.jpg",
  moskyAudio_sky_reverb_delay_1: "https://i.ibb.co/hFf5wVj1/5fe45bc536993.jpg",
  moskyAudio_sky_reverb_delay_2: "https://i.ibb.co/jkqsnBYB/5fe45bc53747f.jpg",

  // Imagenes del sol918 multi effects
  moskyAudio_sol918_multi_effects_photo_0: "https://i.ibb.co/s9PBjFv2/60da9377a8597.jpg",
  moskyAudio_sol918_multi_effects_photo_1: "https://i.ibb.co/GQ9yyTnD/60da9377a7d6c.jpg",
  moskyAudio_sol918_multi_effects_photo_2: "https://i.ibb.co/hxBFwvFh/60da9377a766c.jpg",
  // Imagenes del blue ocean chorus
  moskyAudio_blue_ocean_chorus_0: "https://i.ibb.co/QFYmn9Xf/60da8feaaaca0.jpg",
  moskyAudio_blue_ocean_chorus_1: "https://i.ibb.co/3Yrsgy5H/60da8feaab6fb.jpg",
  moskyAudio_blue_ocean_chorus_2: "https://i.ibb.co/HfTJKJ9W/60da8feaabf45.jpg",

  // Imagenes del mad cow
  moskyAudio_mad_cow_0: "https://i.ibb.co/0ypv03vF/65f402af36bdd.jpg",
  moskyAudio_mad_cow_1: "https://i.ibb.co/JWtWCqL7/65faa0e789bb6.jpg",
  moskyAudio_mad_cow_2: "https://i.ibb.co/Q75Nt253/65faa0e7962c5.jpg",
  moskyAudio_mad_cow_3: "https://i.ibb.co/C5HPhKNj/65faa0e796d59.jpg",

  // Imagenes del effect pedal cable
  moskyAudio_effect_pedal_cable: "https://i.ibb.co/kgVHnnhr/581c4ce5297da.png",
  
  /**
   * M-VAVE Products
   */
  // Imagenes del pedal mini Universe
  mvave_mini_universe_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/10339783.jpg",
  mvave_mini_universe_photo_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/10339785.jpg",
  mvave_mini_universe_photo_2: "https://img.website.xin/contents/sitefiles3604/18022920/images/11019448.jpg",
  // Imagenes del pedal Elemental
  mvave_elemental_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/9719731.jpg",
  mvave_elemental_photo_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/9719728.jpg",
  mvave_elemental_photo_2: "https://img.website.xin/contents/sitefiles3604/18022920/images/9719730.jpg",
  // Imagenes del Annblackbox
  mvave_annblackbox_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/10219104.jpg",
  mvave_annblackbox_photo_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/10219108.jpg",
  mvave_annblackbox_photo_2:  "https://img.website.xin/contents/sitefiles3604/18022920/images/10219107.jpg",
  // Imagenes del IR BOX
  mvave_ir_box_phot_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/9720172.jpg",
  mvave_ir_box_phot_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/9720176.jpg",
  mvave_ir_box_phot_2: "https://img.website.xin/contents/sitefiles3604/18022920/images/9720173.jpg",
  // Imagenes del M VAVE CUBE BABY
  mvave_baby_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/8570933.png",
  mvave_baby_photo_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/8570936.jpg",
  mvave_baby_photo_2: "https://img.website.xin/contents/sitefiles3604/18022920/images/8570935.jpg",
  // Imagenes de M VAVE TANK G
  mvave_tank_g_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/8376698.png",
  mvave_tank_g_photo_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/8376699.png",
  mvave_tank_g_photo_2: "https://img.website.xin/contents/sitefiles3604/18022920/images/8376700.png",
  // Imagenes de M VAVE TANK B 
  mvave_tank_b_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/8376701.png",
  mvave_tank_b_photo_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/8376702.png",
  mvave_tank_b_photo_2: "https://img.website.xin/contents/sitefiles3604/18022920/images/8376700.png",
  // Imagenes de M VAVE CHOCOLATE 
  mvave_chocolate_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/11350155.jpg",
  mvave_chocolate_photo_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/11350157.jpg",
  mvave_chocolate_photo_2: "https://img.website.xin/contents/sitefiles3604/18022920/images/11350158.jpg",
  // Imagenes de M VAVE PEDAL POWER
  mvave_pedal_power_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/8596626.png",
  // Imagenes de M VAVE WP 9
  mvave_wp_9_photo_0: "https://img.website.xin/contents/sitefiles3604/18022920/images/9720023.jpg",
  mvave_wp_9_photo_1: "https://img.website.xin/contents/sitefiles3604/18022920/images/9720024.jpg",
  // Imagenes de wireless in ear monitor_system
  mvave_wireless_in_ear_monitor_system: "https://img.website.xin/contents/sitefiles3604/18022920/images/10710519.jpg",
  // Imagenes de wp 8 wireless system
  mvave_wp_8_wireless_system: "https://img.website.xin/contents/sitefiles3604/18022920/images/8595897.jpg",
};

// Helper function to create products
async function createProduct(
    id: string,
    name: string,
    description: string,
    price: number,
    stock: number,
    categoryId: string,
    images: string[]
  ) {
  return await prisma.product.upsert({
    where: { id },
    update: {},
    create: {
      id,
      name,
      description,
      price,
      stock,
      categoryId,
      images,
    },
  });
}

async function main() {
  try {
    console.log('🌱 Starting seed...');

    // Create admin user
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('johndoe123', 10);
    
    const adminUser = await prisma.user.upsert({
      where: { email: 'john@doe.com' },
      update: {},
      create: {
        email: 'john@doe.com',
        password: hashedPassword,
        name: 'John Doe',
        role: 'ADMIN',
      },
    });
    console.log('✅ Admin user created:', adminUser.email);

    // Create categories
    console.log('Creating categories...');
    const electronica = await prisma.category.upsert({
      where: { slug: 'electronica' },
      update: {},
      create: {
        name: 'Electrónica',
        slug: 'electronica',
        description: 'Dispositivos electrónicos y tecnología de última generación',
      },
    });
    const accessory = await prisma.category.upsert({
      where: { slug: 'accesorios' },
      update: {},
      create: {
        name: 'Accesorios',
        slug: 'accesorios',
        description: 'Herramientas y complementos más avanzados que tenemos',
      },
    });


    // Now create sample addresses for the admin user
console.log('Creating sample addresses...');
await prisma.address.createMany({
  data: [
    {
      userId: adminUser.id,
      name: 'Home Address',
      street: '123 Main St',
      city: 'Anytown',
      postalCode: '12345',
      country: 'USA',
      phone: '+1234567890',
      isDefault: true,
    },
    {
      userId: adminUser.id,
      name: 'Work Address',
      street: '456 Office Blvd',
      city: 'Business City',
      postalCode: '67890',
      country: 'USA',
      phone: '+0987654321',
      isDefault: false,
    },
  ],
  skipDuplicates: true, // Avoid errors if addresses already exist
});
    
    const pedal_effect = await prisma.category.upsert({
      where: { slug: 'pedal_effect' },
      update: {},
      create: {
        name: 'Pedales de Efectos',
        slug: 'pedal_effect',
        description: 'Los mejores pedales de efectos que tenemos',
      },
    });

    console.log('✅ Categories created');
    // Create products
    console.log('Creating products...');

    // MoskyAudio Products - Pedal Effects
    await createProduct(
      'bright-flame-amp-001',
      'MoskyAudio Bright Flame Amp - MoskyAudio',
      'MULTI GUITAR AMPLIFIER. You have now in your hands the most versatile, useful and amazing sounding piece of gear. The first Zero watt stereo amplifier that will fit in your pedalboard and replace a full amplifier signal chain, achieving unprecedented analog realism thanks to its stereo mic\'d cabinet simulation, stereo FX loop, tube-like power amp stage, and a full featured clean preamp based on 3 classic amps.',
      90.00,
      3,
      pedal_effect.id,
      [
        productImages.moskyAudio_bright_flame_amp_photo_0,
        productImages.moskyAudio_bright_flame_amp_photo_1,
        productImages.moskyAudio_bright_flame_amp_photo_2,
        productImages.moskyAudio_bright_flame_amp_photo_3,
      ]
    );

    await createProduct(
      'g-iii-blue-purple-001',
      'MoskyAudio G III BLUE Purple Channel Preamp/Overdrive/Distortion',
      'MoskyAudio G III BLUE Purple Channel Preamp/Overdrive/Distortion pedal. A versatile multi-stage effects pedal perfect for guitarists looking for classic tube amp tones.',
      45.00,
      10,
      pedal_effect.id,
      [productImages.moskyAudio_g_iii_blue_purple_photo_0]
    );

    await createProduct(
      'overdrive-dolphin-001',
      'MoskyAudio DOLPHIN OverDrive',
      'The DOLPHIN OverDrive pedal delivers smooth, creamy overdrive tones with excellent touch sensitivity. Perfect for blues, rock, and everything in between.',
      35.00,
      15,
      pedal_effect.id,
      [
        productImages.moskyAudio_overdrive_dolphin_photo_0,
        productImages.moskyAudio_overdrive_dolphin_photo_1,
        productImages.moskyAudio_overdrive_dolphin_photo_2,
      ]
    );

    await createProduct(
      'lm741-preamp-001',
      'MoskyAudio LM741 PREAMP',
      'High-quality preamp pedal based on the classic LM741 op-amp. Provides clean, transparent amplification with excellent headroom and low noise.',
      30.00,
      20,
      pedal_effect.id,
      [
        productImages.moskyAudio_lm741_preamp_0, 
        productImages.moskyAudio_lm741_preamp_1,
        productImages.moskyAudio_lm741_preamp_2,
        productImages.moskyAudio_lm741_preamp_3
      ]
    );

    await createProduct(
      'cosmic-blue-001',
      'MoskyAudio COSMIC BLUE',
      'The COSMIC BLUE pedal offers a wide range of modulation effects. From subtle chorus to deep vibrato, this pedal is a must-have for any guitarist.',
      40.00,
      12,
      pedal_effect.id,
      [productImages.moskyAudio_cosmic_blue]
    );

    await createProduct(
      'sky-reverb-delay-001',
      'MoskyAudio KY REVERB & DELAY',
      'Combined reverb and delay effects pedal. Create lush ambient soundscapes with the reverb section and add depth with the delay. Perfect for atmospheric playing.',
      50.00,
      10,
      pedal_effect.id,
      [
        productImages.moskyAudio_sky_reverb_delay_0, 
        productImages.moskyAudio_sky_reverb_delay_1,
        productImages.moskyAudio_sky_reverb_delay_2
      ]
    );

    await createProduct(
      'sol918-multi-effects-001',
      'MoskyAudio SOL918 Multi-Effects Pedal',
      'Comprehensive multi-effects pedal featuring a wide range of effects including distortion, delay, reverb, and modulation. All-in-one solution for versatile tone shaping.',
      85.00,
      5,
      pedal_effect.id,
      [
        productImages.moskyAudio_sol918_multi_effects_photo_0,
        productImages.moskyAudio_sol918_multi_effects_photo_1,
        productImages.moskyAudio_sol918_multi_effects_photo_2,
      ]
    );

    await createProduct(
      'blue-ocean-chorus-001',
      'MoskyAudio Blue Ocean Chorus',
      'Classic analog chorus effect with rich, warm modulation. The Blue Ocean Chorus adds depth and movement to your tone, perfect for clean passages and rhythm work.',
      38.00,
      15,
      pedal_effect.id,
      [
        productImages.moskyAudio_blue_ocean_chorus_0,
        productImages.moskyAudio_blue_ocean_chorus_1,
        productImages.moskyAudio_blue_ocean_chorus_2
      ]
    );

    await createProduct(
      'mad-cow-001',
      'MoskyAudio MAD COW',
      'Aggressive distortion pedal with massive gain and sustain. The MAD COW delivers crushing high-gain tones perfect for metal and hard rock.',
      42.00,
      12,
      pedal_effect.id,
      [
        productImages.moskyAudio_mad_cow_0,
        productImages.moskyAudio_mad_cow_1,
        productImages.moskyAudio_mad_cow_2,
        productImages.moskyAudio_mad_cow_3,
      ]
    );

    // MoskyAudio Products - Accessories
    await createProduct(
      'iso10-power-supply-001',
      'MoskyAudio ISO-10 POWER SUPPLY',
      'Isolated power supply with 10 outputs. Provides clean, isolated power for your entire pedalboard, eliminating noise and hum from daisy-chained power supplies.',
      55.00,
      8,
      electronica.id,
      [
        productImages.moskyAudio_iso10_power_supply_0, 
        productImages.moskyAudio_iso10_power_supply_1, 
        productImages.moskyAudio_iso10_power_supply_2
      ]
    );

    await createProduct(
      'moskyaudio-effect-pedal-cable-001',
      'MoskyAudio Effect Pedal Cable',
      'High-quality patch cable for connecting effects pedals. Durable construction with gold-plated connectors for optimal signal transfer and minimal noise.',
      12.00,
      50,
      accessory.id,
      [productImages.moskyAudio_effect_pedal_cable]
    );

    // M-VAVE Products - Pedal Effects
    await createProduct(
      'mvave-mini-universe-001',
      'M-VAVE Mini Universe',
      'This product is a compact metal appearance design.There are 9 reverbs in total, it can be adapted to a variety of music.MINI-UNIVERSE will let you get warm and natural timbre, also it has dynamic response. High performance digital signal processor, to provide you with a nuanced sound. True bypass.',
      65.00,
      8,
      pedal_effect.id,
      [
        productImages.mvave_mini_universe_photo_0,
        productImages.mvave_mini_universe_photo_1,
        productImages.mvave_mini_universe_photo_2,
      ]
    );

    await createProduct(
      'mvave-elemental-001',
      'M-VAVE Elemental',
      'The Elemental pedal offers essential effects in a compact design. Perfect for guitarists who want quality effects without the complexity.',
      55.00,
      10,
      pedal_effect.id,
      [
        productImages.mvave_elemental_photo_0,
        productImages.mvave_elemental_photo_1,
        productImages.mvave_elemental_photo_2,
      ]
    );

    await createProduct(
      'mvave-annblackbox-001',
      'M-VAVE Ann Black Box',
      'Professional effects processor with advanced algorithms. The Ann Black Box delivers studio-quality effects in a pedal format.',
      75.00,
      6,
      pedal_effect.id,
      [
        productImages.mvave_annblackbox_photo_0,
        productImages.mvave_annblackbox_photo_1,
        productImages.mvave_annblackbox_photo_2,
      ]
    );

    await createProduct(
      'mvave-baby-001',
      'M-VAVE Baby',
      'Compact and versatile effects pedal perfect for beginners and professionals alike. The Baby delivers big tone in a small package.',
      45.00,
      15,
      pedal_effect.id,
      [
        productImages.mvave_baby_photo_0,
        productImages.mvave_baby_photo_1,
        productImages.mvave_baby_photo_2,
      ]
    );

    await createProduct(
      'mvave-chocolate-001',
      'M-VAVE Chocolate',
      'Warm and smooth effects pedal with rich, creamy tones. The Chocolate adds sweetness to your signal with its unique character.',
      50.00,
      12,
      pedal_effect.id,
      [
        productImages.mvave_chocolate_photo_0,
        productImages.mvave_chocolate_photo_1,
        productImages.mvave_chocolate_photo_2,
      ]
    );

    // M-VAVE Products - Accessories
    await createProduct(
      'mvave-ir-box-001',
      'M-VAVE IR Box',
      'Impulse Response loader for authentic amp cabinet simulation. Load your favorite IRs and get studio-quality tones on stage.',
      80.00,
      5,
      pedal_effect.id,
      [
        productImages.mvave_ir_box_phot_0,
        productImages.mvave_ir_box_phot_1,
        productImages.mvave_ir_box_phot_2,
      ]
    );

    await createProduct(
      'mvave-tank-g-001',
      'M-VAVE Tank G',
      'High-quality effects tank with green finish. Durable construction and professional-grade components for reliable performance.',
      60.00,
      8,
      pedal_effect.id,
      [
        productImages.mvave_tank_g_photo_0,
        productImages.mvave_tank_g_photo_1,
        productImages.mvave_tank_g_photo_2,
      ]
    );

    await createProduct(
      'mvave-tank-b-001',
      'M-VAVE Tank B',
      'TANK-B is a portable and multifunctional bass effector.Built in rechargeable battery. 36 editable Presets inside, user can customize effectors chain then save it.Equipped with Noise Gate,Compressor,9 Preamp selection slots,3-band EQ,3 Modulations,1 Delay,1 Reverb, 8 IR CAB slots and a Tuner.User can download the computer software or APP from our official website, then use them to edit presets, exchange presets, share presets, import/export presets,import IR file, restore the factory Settings and customize the color that each preset footswitch-light displays.Support mobile phone recording, wireless connection, earphone monitoring, XLR balanced output, and can be used as computer sound card.',
      60.00,
      8,
      pedal_effect.id,
      [
        productImages.mvave_tank_b_photo_0,
        productImages.mvave_tank_b_photo_1,
        productImages.mvave_tank_b_photo_2,
      ]
    );

    await createProduct(
      'mvave-pedal-power-001',
      'M-VAVE Pedal Power',
      'Isolated power supply for your pedalboard. Provides clean, noise-free power to all your effects pedals with multiple voltage options.',
      70.00,
      7,
      electronica.id,
      [productImages.mvave_pedal_power_photo_0]
    );

    await createProduct(
      'mvave-wp-9-001',
      'M-VAVE WP-9',
      'Professional wireless system for instruments. Reliable transmission with low latency, perfect for live performances and studio use.',
      120.00,
      6,
      electronica.id,
      [
        productImages.mvave_wp_9_photo_0,
        productImages.mvave_wp_9_photo_1,
      ]
    );

    await createProduct(
      'mvave-wireless-in-ear-monitor-001',
      'M-VAVE Wireless In-Ear Monitor System',
      'Professional wireless in-ear monitoring system. Crystal clear audio transmission with multiple channels for band members and performers.',
      200.00,
      4,
      electronica.id,
      [productImages.mvave_wireless_in_ear_monitor_system]
    );

    await createProduct(
      'mvave-wp-8-wireless-001',
      'M-VAVE WP-8 Wireless System',
      'Compact wireless system for guitar and bass. Easy to use with excellent range and sound quality. Perfect for stage and studio.',
      110.00,
      7,
      electronica.id,
      [productImages.mvave_wp_8_wireless_system]
    );

    console.log('✅ Products created');
    console.log('🎉 Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
});