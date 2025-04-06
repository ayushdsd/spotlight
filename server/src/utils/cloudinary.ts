import { v2 as cloudinary, UploadApiOptions, UploadApiResponse } from 'cloudinary';
import fs from 'fs';

export const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
};

interface CloudinaryUploadOptions extends Omit<UploadApiOptions, 'resource_type'> {
  folder?: string;
  resource_type?: 'image' | 'video' | 'raw' | 'auto';
}

interface CloudinaryUploadResult {
  secure_url: string;
  bytes: number;
  format: string;
  duration?: number;
  width?: number;
  height?: number;
}

export const cloudinaryUpload = async (
  file: Express.Multer.File,
  options: CloudinaryUploadOptions = {}
): Promise<CloudinaryUploadResult> => {
  try {
    // Configure cloudinary if not already configured
    cloudinaryConfig();

    const uploadOptions: UploadApiOptions = {
      ...options,
      resource_type: options.resource_type || 'auto',
    };

    // Read file as buffer
    const buffer = fs.readFileSync(file.path);

    // Upload buffer to cloudinary
    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
        if (error) reject(error);
        if (result) resolve(result);
      }).end(buffer);
    });

    // Delete local file after upload
    fs.unlinkSync(file.path);

    return {
      secure_url: result.secure_url,
      bytes: result.bytes,
      format: result.format,
      ...(result.duration && { duration: result.duration }),
      ...(result.width && { width: result.width, height: result.height }),
    };
  } catch (error: any) {
    console.error('Cloudinary upload error:', error);
    // Clean up local file if it exists
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw new Error(error?.message || 'Error uploading file to Cloudinary');
  }
};

export const cloudinaryDelete = async (url: string): Promise<void> => {
  try {
    const publicId = url.split('/').slice(-1)[0].split('.')[0];
    await cloudinary.uploader.destroy(publicId);
  } catch (error: any) {
    console.error('Cloudinary delete error:', error);
    throw new Error(error?.message || 'Error deleting file from Cloudinary');
  }
};
