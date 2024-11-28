"use client";

import { redirect } from 'next/navigation'
import SteamSignIn from "steam-signin";

// import { createClient } from '@/helper/supabase/server'
// import { headers } from 'next/headers';

function getPatreonLoginUrl() {
    const queryString = new URLSearchParams({
        response_type: 'code',
        client_id: process.env.NEXT_PUBLIC_PATREON_CLIENT_ID!,
        redirect_uri: `${origin}/auth/link/patreon`,
        scope: 'identity identity.memberships',
        allow_signup: 'false',
    }).toString();

    return `https://www.patreon.com/oauth2/authorize?${queryString}`;
}

function getSteamLoginUrl() {
    // let signIn = new SteamSignIn('https://aoe2companion.com');
    let signIn = new SteamSignIn(origin);
    return signIn.getUrl(`${origin}/auth/link/steam`);
}

export default function AccountPage() {
    // const host = (await headers()).get('X-Forwarded-Host');
    // const proto = (await headers()).get('X-Forwarded-Proto');
    // console.log('origin host', host);
    // console.log('origin proto', proto);
    //
    //
    // const origin = (await headers()).get("host");
    // console.log('origin headers', origin);
    // console.log('getPatreonLoginUrl()', await getPatreonLoginUrl());
    //
    // const { data, error } = await supabase.auth.getUser()
    // if (error || !data?.user) {
    //     redirect('/login')
    // }

    return <div>
        {/*<p>Hello account {data.user.email}</p>*/}

        <a href={getPatreonLoginUrl()}>Link Patreon</a>
        <br/>
        <br/>
        <a href={getSteamLoginUrl()}>Link Steam</a>
    </div>;
}
