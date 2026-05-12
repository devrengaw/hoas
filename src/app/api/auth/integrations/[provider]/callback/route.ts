import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const TOKEN_URLS: Record<string, string> = {
  google: 'https://oauth2.googleapis.com/token',
  zoom: 'https://zoom.us/oauth/token',
  teams: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  const { provider } = await params;
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const profileId = searchParams.get('state');

  if (!code || !profileId) {
    return NextResponse.redirect(`${new URL(request.url).origin}/dashboard/settings/profile?error=invalid_callback`);
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    // Exchange the code for tokens
    const clientId = process.env[`${provider.toUpperCase()}_CLIENT_ID`];
    const clientSecret = process.env[`${provider.toUpperCase()}_CLIENT_SECRET`];
    const redirectUri = `${new URL(request.url).origin}/api/auth/integrations/${provider}/callback`;

    const tokenResponse = await fetch(TOKEN_URLS[provider], {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        ...(provider === 'zoom' && {
          'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
        })
      },
      body: new URLSearchParams({
        client_id: clientId!,
        client_secret: clientSecret!,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokens = await tokenResponse.json();

    if (tokens.error) throw new Error(tokens.error_description || tokens.error);

    // 2. Save tokens to user_integrations
    const { error: upsertError } = await supabase
      .from('user_integrations')
      .upsert({
        profile_id: profileId,
        provider: provider,
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: tokens.expires_in ? new Date(Date.now() + tokens.expires_in * 1000).toISOString() : null,
        metadata: {
          scope: tokens.scope,
          token_type: tokens.token_type
        },
        is_active: true
      });

    if (upsertError) throw upsertError;

    // Redirect back with success
    return NextResponse.redirect(`${new URL(request.url).origin}/dashboard/settings/profile?success=integrated&provider=${provider}`);

  } catch (error: any) {
    console.error('OAuth Callback Error:', error);
    return NextResponse.redirect(`${new URL(request.url).origin}/dashboard/settings/profile?error=${encodeURIComponent(error.message)}`);
  }
}
