import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

interface UserSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  newsletter: boolean;
  twoFactorEnabled: boolean;
  language: string;
  theme: 'light' | 'dark' | 'system';
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        settings: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const defaultSettings: UserSettings = {
      emailNotifications: true,
      smsNotifications: false,
      newsletter: true,
      twoFactorEnabled: false,
      language: 'es',
      theme: 'system',
    };

    const settings = user.settings ? JSON.parse(user.settings as string) : defaultSettings;

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const settings: UserSettings = await request.json();

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

    return NextResponse.json(JSON.parse(updatedUser.settings as string));
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
