import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { generatePresignedUploadUrl } from "@/lib/s3";
// POST /api/upload/presigned
export async function POST(request: Request) {
  // Verificar sesión y rol de usuario
  try {
    // Obtener la sesión del usuario
    const session = await getServerSession(authOptions);
    // Verificar si el usuario es ADMIN
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "No autorizado" },
        { status: 401 }
      );
    }
    // Parsear el cuerpo de la solicitud
    const body = await request.json();
    const { fileName, contentType } = body;
    // Validar parámetros
    if (!fileName || !contentType) {
      return NextResponse.json(
        { error: "Faltan parámetros" },
        { status: 400 }
      );
    }
    // Generar URL pre-firmada
    const { uploadUrl, cloud_storage_path } = await generatePresignedUploadUrl(
      fileName,
      contentType,
      true // isPublic
    );
    // Responder con la URL pre-firmada
    return NextResponse.json({ uploadUrl, cloud_storage_path });
  } catch (error) {
    console.error("Error generating presigned URL:", error);
    return NextResponse.json(
      { error: "Error al generar URL" },
      { status: 500 }
    );
  }
}
