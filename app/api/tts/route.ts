import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/app/(auth)/auth';
import { getUsageCountByUserId, saveUsage } from '@/lib/db/queries';
import { entitlementsByUserType } from '@/lib/ai/entitlements';
 
export async function POST(request: NextRequest) {
  console.log('TTS API: Request received');
  console.log('TTS API: Headers:', Object.fromEntries(request.headers.entries()));
  console.log('TTS API: Cookies:', request.cookies.getAll());
  
  try {
    console.log('TTS API: Calling auth()...');
    const session = await auth();
    console.log('TTS API: Session:', !!session, !!session?.user);
    if (!session?.user) {
      console.log('TTS API: Unauthorized');
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
 
    const userType = session.user.type;
    const usageCount = await getUsageCountByUserId({
      id: session.user.id,
      type: 'tts',
      differenceInHours: 24,
    });
 
    if (usageCount >= entitlementsByUserType[userType].maxTTSPerDay) {
      return NextResponse.json(
        { success: false, error: 'TTS generation limit reached. Please try again later.' },
        { status: 429 }
      );
    }
 
    const { text, voiceId, voice_settings } = await request.json();
 
    if (!text) {
      return NextResponse.json(
        { success: false, error: 'Text is required' },
        { status: 400 }
      );
    }
 
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: 'API configuration error' },
        { status: 500 }
      );
    }
 
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId || '21m00Tcm4TlvDq8ikWAM'}`,
      {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKey
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_turbo_v2_5',
          voice_settings
        })
      }
    );
 
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { success: false, error: errorData.detail?.message || 'Failed to generate speech' },
        { status: response.status }
      );
    }
 
    const audioBlob = await response.blob();
    
    // Increment usage
    await saveUsage({ userId: session.user.id, type: 'tts' });
 
    return new NextResponse(audioBlob, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
 
  } catch (error) {
    console.error('Error in TTS API:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
