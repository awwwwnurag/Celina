import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure Cloudinary
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('Cloudinary SDK configured.');
} else {
  console.log('Warning: Cloudinary credentials missing in .env');
}

// Memory storage is used because we don't store files locally,
// we just temporarily buffer them and stream them directly to Cloudinary.
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

/**
 * Uploads a file buffer directly to Cloudinary into a subfolder under fashion-store/
 */
const uploadToCloudinary = (fileBuffer, folder = 'misc') => {
  return new Promise((resolve, reject) => {
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      // Mock upload fallback for local testing without credentials
      const simulatedUrl = `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800`;
      return resolve({
        public_id: `fashion-store/${folder}/mock_${Date.now()}`,
        url: simulatedUrl
      });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `fashion-store/${folder}`,
        resource_type: 'auto'
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({
          public_id: result.public_id,
          url: result.secure_url
        });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Deletes an asset from Cloudinary using its public_id
 */
const deleteFromCloudinary = async (public_id) => {
  if (!public_id || !process.env.CLOUDINARY_CLOUD_NAME) return null;
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return result;
  } catch (error) {
    console.error(`Failed to delete asset ${public_id} from Cloudinary:`, error);
    return null;
  }
};

export { upload, cloudinary, uploadToCloudinary, deleteFromCloudinary };
export default upload;
