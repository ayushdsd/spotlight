import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Test MongoDB Connection
async function testMongoConnection() {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log('✅ MongoDB Connected Successfully!');
    return true;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error);
    return false;
  }
}

// Test Cloudinary Connection
async function testCloudinaryConnection() {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    // Test the connection by requesting account details
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary Connected Successfully!');
    return true;
  } catch (error) {
    console.error('❌ Cloudinary Connection Error:', error);
    return false;
  }
}

// Run tests
async function runTests() {
  console.log('Testing connections...\n');
  
  const mongoResult = await testMongoConnection();
  const cloudinaryResult = await testCloudinaryConnection();
  
  if (mongoResult && cloudinaryResult) {
    console.log('\n✨ All connections successful!');
  } else {
    console.log('\n⚠️ Some connections failed. Please check the errors above.');
  }
  
  // Close MongoDB connection
  await mongoose.disconnect();
  process.exit();
}

runTests();
