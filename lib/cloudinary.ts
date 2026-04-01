import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
// make sure all required environment variables are defined. This
// helps surface problems early instead of getting a 401 from the
// SDK when the credentials are missing or account is disabled.
const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  // application will still start but any call to `cloudinary` will
  // immediately fail with a helpful message.
  console.error(
    'Missing Cloudinary configuration. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in your environment.'
  );
}

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

export default cloudinary;

export async function uploadToCloudinary(
  fileBuffer: Buffer,
  fileName: string,
  folder: string = 'ecommerce/products'
): Promise<{ url: string; publicId: string }> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: `${Date.now()}-${fileName}`,
        resource_type: 'auto',
        transformation: [
          { width: 1200, height: 1200, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) {
          reject(error);
        } else if (result) {
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    );

    uploadStream.end(fileBuffer);
  });
}

export async function deleteFromCloudinary(publicId: string): Promise<void> {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
}

export function getCloudinaryUrl(
  publicId: string,
  transformation?: Parameters<typeof cloudinary.url>[1]
): string {
  return cloudinary.url(publicId, transformation);
}
