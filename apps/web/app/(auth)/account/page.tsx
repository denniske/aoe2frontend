"use client";

import SteamSignIn from "steam-signin";
import useAuth from "@/hooks/use-auth";

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
    let signIn = new SteamSignIn(origin);
    return signIn.getUrl(`${origin}/auth/link/steam`);
}

export default function AccountPage() {
    const user = useAuth();

    return <div>
        <p>Hello account {user?.email}</p>
        <br/>
        <br/>
        <a href={getPatreonLoginUrl()}>Link Patreon</a>
        <br/>
        <br/>
        <a href={getSteamLoginUrl()}>Link Steam</a>
    </div>;
}
