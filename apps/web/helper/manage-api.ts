import {fromUnixTime} from "date-fns";
import {fetchJson, makeQueryString, removeReactQueryParams} from "./util";
import {camelizeKeys, decamelizeKeys} from "humps";
import {
    IFetchLeaderboardParams,
    IFetchMatchesParams,
    IFetchProfileParams, IFetchProfileRatingParams,
    ILeaderboard,
    ILeaderboardDef,
    IMatchesResult, IProfileRatingsResult, IProfileResult, IProfilesResult
} from "./api.types";
import {getConfig} from "./config";
import process from "node:process";
import {NextResponse} from "next/server";

const config = getConfig();
const baseUrl = `http://localhost:3332`;
// const baseUrl = `https://api.${config.host}`;

// export async function manageAccountCreate(accountId: string, steamId: string) {
//     const result = await fetch(`${baseUrl}/manage/account/create`, {
//         body: JSON.stringify({
//             accountId,
//         }),
//         method: 'POST',
//         headers: {
//             'api_key': process.env.AOECOMPANION_MANAGE_API_KEY!,
//             'Content-Type': 'application/json',
//         },
//     });
//
//     if (result.status !== 200) {
//         throw new Error("API: Failed to create account");
//     }
// }

export async function manageLinkSteam(accountId: string, steamId: string) {
    const result = await fetch(`${baseUrl}/manage/link/steam`, {
        body: JSON.stringify({
            steamId,
            accountId,
        }),
        method: 'POST',
        headers: {
            'api_key': process.env.AOECOMPANION_MANAGE_API_KEY!,
            'Content-Type': 'application/json',
        },
    });

    if (!result.ok) {
        throw new Error("API: Failed to link Steam account");
    }
}
