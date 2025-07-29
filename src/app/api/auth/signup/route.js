import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect'
import User from '../../../../models/userModel';
import bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

export async function POST(request) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const name = formData.get('username');
    const email = formData.get('email');
    const password = formData.get('password');
    const imageFile = formData.get('imageFile');

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }
    
    let imageUrl = '';
 
    if (imageFile) {
        const fileBuffer = await imageFile.arrayBuffer();
        const mime = imageFile.type;
        const encoding = 'base64';
        const base64Data = Buffer.from(fileBuffer).toString('base64');
        const fileUri = 'data:' + mime + ';' + encoding + ',' + base64Data;
        
        const result = await cloudinary.uploader.upload(fileUri, {
            folder: 'leaderboard-app-users',
        });
        imageUrl = result.secure_url;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      imageUrl: imageUrl || undefined, 
    });

    await newUser.save();

    return NextResponse.json({ message: 'User created successfully', user: { name: newUser.name, email: newUser.email } }, { status: 201 });
  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ message: 'An error occurred during signup', error: error.message }, { status: 500 });
  }
}