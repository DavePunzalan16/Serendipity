# Google OAuth Setup Guide

This document describes how to configure Google OAuth for the Wander app across web and mobile platforms.

## Prerequisites

- A Supabase project with Authentication enabled
- A Google Cloud Console project with OAuth consent screen configured

## Step 1: Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → APIs & Services → Credentials
2. Click "Create Credentials" → "OAuth client ID"
3. Select "Web application" as the application type
4. Set the name (e.g., "Wander OAuth Client")
5. Add authorized redirect URIs:
   - `https://<your-supabase-project>.supabase.co/auth/v1/callback`
6. Copy the **Client ID** and **Client Secret**

## Step 2: Enable Google Provider in Supabase

1. Go to your Supabase Dashboard → Authentication → Providers
2. Find "Google" in the provider list and enable it
3. Paste the **Client ID** from Step 1
4. Paste the **Client Secret** from Step 1
5. Save the configuration

## Step 3: Configure Authorized Redirect URIs

In Google Cloud Console, ensure the following redirect URIs are added:

### For Web (Next.js)
- `https://<your-supabase-project>.supabase.co/auth/v1/callback`

Supabase handles the redirect internally, then redirects back to your app's callback URL:
- `{SITE_URL}/api/auth/callback` (configured in Supabase Dashboard → URL Configuration)

### For Mobile (Expo)
The mobile app uses the `wander://` custom scheme. The flow is:
1. App opens the Google consent URL in the system browser
2. Google redirects to Supabase's callback
3. Supabase redirects to `wander://auth/callback` with tokens in the URL fragment

No additional redirect URIs are needed in Google Cloud Console for mobile — Supabase
handles the redirect via its own callback URL.

## Step 4: Set Supabase Site URL and Redirect URLs

1. Go to Supabase Dashboard → Authentication → URL Configuration
2. Set **Site URL** to your production web URL (e.g., `https://wander.app`)
3. Add allowed **Redirect URLs**:
   - `http://localhost:3000/api/auth/callback` (local dev)
   - `https://wander.app/api/auth/callback` (production)
   - `wander://auth/callback` (mobile deep link)

## Step 5: Environment Variables

### Web (`apps/web/.env.local`)

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

### Mobile (`apps/mobile/.env`)

```env
EXPO_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

## How It Works

### Web Flow

1. User clicks "Sign in with Google" → navigates to `GET /api/auth/google`
2. The route calls `supabase.auth.signInWithOAuth({ provider: 'google' })` with
   `redirectTo: /api/auth/callback`
3. User is redirected to Google's consent screen
4. After consent, Google redirects to Supabase's callback
5. Supabase exchanges the code and redirects to `/api/auth/callback?code=...`
6. The callback route calls `exchangeCodeForSession(code)` to set session cookies
7. User is redirected to `/feed`

### Mobile Flow

1. User taps "Sign in with Google" → calls `initiateGoogleOAuth()`
2. The function calls `signInWithOAuth` with `skipBrowserRedirect: true` and
   `redirectTo: wander://auth/callback`
3. The returned URL is opened in the system browser / auth session
4. After consent, the browser redirects through Supabase back to `wander://auth/callback#access_token=...&refresh_token=...`
5. The app receives the deep link and calls `handleOAuthCallback(url)`
6. The function extracts tokens from the URL fragment and calls `setSession()`
7. Session is persisted in SecureStore

## Troubleshooting

- **"redirect_uri_mismatch"**: Ensure the Supabase callback URL is listed in Google Cloud Console's authorized redirect URIs
- **Mobile deep link not received**: Verify the `scheme: "wander"` is set in `app.config.ts` and the app is built with the scheme registered
- **Session not persisting on web**: Ensure cookies are being set correctly in the callback route (check third-party cookie settings)
- **PKCE errors**: Make sure you're using `@supabase/ssr` v0.5+ which handles PKCE flow automatically
