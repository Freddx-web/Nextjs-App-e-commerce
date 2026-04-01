/**
 * Description: Endpoint para subir imagenes de productos
 */
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { uploadToCloudinary } from '@/lib/cloudinary';
// POST /api/upload/cloudinary
export async function POST(request: Request) {
  // Handle authentication
  try {
    // Get user session
    const session = await getServerSession(authOptions);

    // Check authentication and admin role
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'No autorizado' },
        { status: 401 }
      );
    }
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    // Validate file presence
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ningún archivo' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
      buffer,
      file.name,
      'ecommerce/products'
    );
    // Return success response
    return NextResponse.json({
      url: result.url,
      publicId: result.publicId,
    });
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    return NextResponse.json(
      { error: 'Error al subir la imagen' },
      { status: 500 }
    );
  }
}
