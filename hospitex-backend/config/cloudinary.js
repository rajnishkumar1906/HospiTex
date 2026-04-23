import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dolygexoe',
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = 'hospitex/others';
    
    if (file.fieldname === 'profileImage') folder = 'hospitex/profiles';
    if (file.fieldname === 'file') folder = 'hospitex/consultations';
    if (file.fieldname === 'prescription') folder = 'hospitex/prescriptions';
    if (file.fieldname === 'report') folder = 'hospitex/reports';

    return {
      folder: folder,
      public_id: file.fieldname + '-' + Date.now(),
      resource_type: 'auto', // Support for non-image files like PDF
    };
  },
});

export { cloudinary, storage };
