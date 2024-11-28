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
    const origin = requestUrl.origin;

    console.log('auth/link/steam');
    console.log('origin', origin);
    console.log('request.url', request.url);

    let signIn = new SteamSignIn(origin);
    // let signIn = new SteamSignIn('https://aoe2companion.com');
    let steamId = await signIn.verifyLogin(request.url);
    console.log(`User successfully authenticated as ${steamId.getSteamID64()}`);

    // URL to redirect to after sign up process completes
    return NextResponse.redirect(`${origin}/account`);
}
