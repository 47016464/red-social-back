import { v2 as cloudinary } from 'cloudinary';

export const CloudinaryProvider = {
  provide: 'CLOUDINARY',
  useFactory: () => {
    return cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dp4qwybic',
      api_key: process.env.CLOUDINARY_API_KEY || '969982399153314',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'zw1BmuyufP9RTFeLF4RkKdW6Bqk',
    });
  },
};