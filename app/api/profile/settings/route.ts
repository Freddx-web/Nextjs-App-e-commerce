import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";
// Define the structure of user settings
interface UserSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  newsletter: boolean;
  twoFactorEnabled: boolean;
  language: string;
  theme: 'light' | 'dark' | 'system';
}
// Fetch user settings
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    // Fetch user from database
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        settings: true,
      },
    });
    // If user not found, return error
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }
    // Parse settings or return defaults
    const defaultSettings: UserSettings = {
      emailNotifications: true,
      smsNotifications: false,
      newsletter: true,
      twoFactorEnabled: false,
      language: 'es',
      theme: 'system',
    };
    // If settings are null, return default settings
    const settings = user.settings ? JSON.parse(user.settings as string) : defaultSettings;

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
// Update user settings
export async function PUT(request: NextRequest) {
  try {
    // Fetch user session
    const session = await getServerSession(authOptions);
    // Check if user is authenticated
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    // Parse request body
    const settings: UserSettings = await request.json();
    // Update user settings in database
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        settings: JSON.stringify(settings),
      },
      select: {
        id: true as const,
        name: true as const,
        email: true as const,
        settings: true as const,
      },
    });
    // Return updated settings
    return NextResponse.json(JSON.parse(updatedUser.settings as string));
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
