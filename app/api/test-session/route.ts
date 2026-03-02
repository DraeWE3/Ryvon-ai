import { NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
 
export async function GET() {
  try {
    const session = await auth();
    return NextResponse.json({
      session: !!session,
      user: session?.user || null,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
