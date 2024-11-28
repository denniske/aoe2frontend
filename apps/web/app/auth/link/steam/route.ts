import {NextResponse} from "next/server";
import {createClient} from "@/helper/supabase/server";
import SteamSignIn from 'steam-signin';

export async function GET(request: Request) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.getUser()
    const user = data?.user;

    if (error || !user) {
        return new NextResponse("Supabase Not Logged In", {
            status: 500,
        });
    }

    const requestUrl = new URL(request.url);
    // const code = requestUrl.searchParams.get("code");
    const origin = requestUrl.origin;

    console.log('auth/link/steam');
    // console.log('code', code);
    console.log('origin', origin);
    console.log('request.url', request.url);

    let signIn = new SteamSignIn(origin);
    // let signIn = new SteamSignIn('https://aoe2companion.com');
    let steamId = await signIn.verifyLogin(request.url);
    console.log(`User successfully authenticated as ${steamId.getSteamID64()}`);

    // if (code) {
    //     const body = {
    //         client_id: process.env.NEXT_PUBLIC_PATREON_CLIENT_ID!,
    //         client_secret: process.env.NEXT_PUBLIC_PATREON_CLIENT_SECRET!,
    //         code,
    //         grant_type: "authorization_code",
    //         redirect_uri: `${origin}/auth/link`,
    //     };
    //     const init = {
    //         body: new URLSearchParams(Object.entries(body)).toString(),
    //         method: "POST",
    //         headers: {
    //             "content-type": "application/x-www-form-urlencoded",
    //             accept: "application/json",
    //         },
    //     };
    //     const response = await fetch("https://www.patreon.com/api/oauth2/token", init);
    //     const results = await response.json();
    //     if (results.error) {
    //         return new NextResponse("Patreon Error: " + (results.error_description || results.error), {
    //             status: 500,
    //         });
    //     }
    //
    //     console.log('results', results);
    //
    //     // const text = 'INSERT INTO users(user_id, access, refresh) VALUES($1, $2, $3)'
    //     // const values = [user.id, results.access_token, results.refresh_token]
    //     //
    //     // const res = await client.query(text, values)
    //     // console.log(res)
    //
    //     const ptResponse = await fetch("https://www.patreon.com/api/oauth2/v2/identity?include=memberships.campaign&fields%5Bmember%5D=patron_status", {
    //         method: "GET",
    //         headers: {
    //             accept: "application/json",
    //             Authorization: `Bearer ${results.access_token}`,
    //         },
    //     });
    //
    //     if (ptResponse.status != 200) {
    //         return ptResponse;
    //     }
    //
    //     try {
    //         const patreonCampaignId = '13192796';
    //         const ptData = await ptResponse.json();
    //         console.log('ptData', JSON.stringify(ptData, null, 2));
    //         const sponsorships = ptData?.included
    //             ?.filter(e => e.type === 'member')
    //             ?.filter(e => e.attributes.patron_status === "active_patron")
    //             ?.filter(e => e.relationships.campaign.data.id === patreonCampaignId)
    //         results.patreonOk = sponsorships.length > 0;
    //         console.log('patreonOk', results.patreonOk);
    //     } catch {
    //     }
    // }
    //
    // if (redirectTo) {
    //     return NextResponse.redirect(`${origin}${redirectTo}`);
    // }

    // URL to redirect to after sign up process completes
    return NextResponse.redirect(`${origin}/account`);
}
