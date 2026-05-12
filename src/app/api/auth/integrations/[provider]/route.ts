import { NextResponse } from 'next/server';

const CLIENT_IDS: Record<string, string | undefined> = {
  google: process.env.GOOGLE_CLIENT_ID,
  zoom: process.env.ZOOM_CLIENT_ID,
  teams: process.env.MICROSOFT_CLIENT_ID,
};

const SCOPES: Record<string, string> = {
  google: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly',
  zoom: 'meeting:write user:read',
  teams: 'OnlineMeetings.ReadWrite Calendars.ReadWrite',
};

const AUTH_URLS: Record<string, string> = {
  google: 'https://accounts.google.com/o/oauth2/v2/auth',
  zoom: 'https://zoom.us/oauth/authorize',
  teams: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const clientId = CLIENT_IDS[provider];

  if (!clientId) {
    return NextResponse.json({ error: `Provider ${provider} not configured` }, { status: 400 });
  }

  const redirectUri = `${new URL(request.url).origin}/api/auth/integrations/${provider}/callback`;
  const { searchParams: urlParams } = new URL(request.url);
  const profileId = urlParams.get('profileId');
  
  const searchParams = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES[provider],
    state: profileId || '', // Pass profile ID to identify user on callback
    access_type: 'offline', // For Google
    prompt: 'consent', // For Google
  });

  const url = `${AUTH_URLS[provider]}?${searchParams.toString()}`;

  return NextResponse.redirect(url);
}
