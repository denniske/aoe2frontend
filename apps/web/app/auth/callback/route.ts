import { createClient } from '@/helper/supabase/server'
import { NextResponse } from "next/server";

import { redirect } from 'next/navigation'
import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

// This is used by discord oAuth
export async function GET(request: Request) {
    // The `/auth/callback` route is required for the server-side auth flow implemented
    // by the SSR package. It exchanges an auth code for the user's session.
    // https://supabase.com/docs/guides/auth/server-side/nextjs
    const requestUrl = new URL(request.url);
    const code = requestUrl.searchParams.get("code");
    const origin = requestUrl.origin;
    const redirectTo = requestUrl.searchParams.get("redirect_to")?.toString();

    if (code) {
        const supabase = await createClient();
        await supabase.auth.exchangeCodeForSession(code);
    }

    if (redirectTo) {
        return NextResponse.redirect(`${origin}${redirectTo}`);
    }

    // URL to redirect to after sign up process completes
    return NextResponse.redirect(`${origin}/private`);
}




// export async function GET(request: NextRequest) {
//     const { searchParams } = new URL(request.url)
//     const token_hash = searchParams.get('token_hash')
//     const type = searchParams.get('type') as EmailOtpType | null
//     const next = searchParams.get('next') ?? '/'
//
//     if (token_hash && type) {
//         const supabase = await createClient()
//
//         const { error } = await supabase.auth.verifyOtp({
//             type,
//             token_hash,
//         })
//         if (!error) {
//             // redirect user to specified redirect URL or root of app
//             redirect(next)
//         }
//     }
//
//     // redirect the user to an error page with some instructions
//     redirect('/error')
// }
