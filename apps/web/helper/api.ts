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

const config = getConfig();
// const baseUrl = `http://localhost:3335`;
const baseUrl = `https://data.${config.host}`;

export async function fetchProfileRatings(params: IFetchProfileRatingParams) {
    console.log('fetchProfileRatings', params);
    const queryString = makeQueryString(decamelizeKeys({
        ...removeReactQueryParams(params),
        page: params.pageParam || 1,
    }));
    const url = `${baseUrl}/api/profile/${params.profileId}/ratings?${queryString}`;
    return camelizeKeys(await fetchJson('fetchProfileRatings', url)) as IProfileRatingsResult;
}

// export async function fetchProfileLeaderboard(params: IFetchProfileRatingParams) {
//     console.log('fetchProfileLeaderboard', params);
//     const queryString = makeQueryString(decamelizeKeys({
//         ...removeReactQueryParams(params),
//         page: params.pageParam || 1,
//     }));
//     const url = `${baseUrl}/api/profile/ratings?${queryString}`;
//     return camelizeKeys(await fetchJson('fetchProfileLeaderboard', url)) as IProfileRatingsResult;
// }

export async function fetchProfile(params: IFetchProfileParams) {
    console.log('fetchProfile', params);
    const queryString = makeQueryString(decamelizeKeys({
        ...removeReactQueryParams(params),
        page: params.pageParam || 1,
    }));
    const url = `${baseUrl}/api/profiles/${params.profileId}?${queryString}`;
    return camelizeKeys(await fetchJson('fetchProfile', url)) as IProfileResult;
}

export async function fetchProfiles(params: IFetchProfileParams) {
    console.log('fetchProfiles', params);
    const queryString = makeQueryString(decamelizeKeys({
        ...removeReactQueryParams(params),
        page: params.pageParam || 1,
    }));
    const url = `${baseUrl}/api/profiles?${queryString}`;
    return camelizeKeys(await fetchJson('fetchProfile', url)) as IProfilesResult;
}

// export async function fetchProfile(params: IFetchProfileParams) {
//     console.log('fetchProfile', params);
//     const queryString = makeQueryString(decamelizeKeys({
//         ...removeReactQueryParams(params),
//         page: params.pageParam || 1,
//     }));
//     const url = `${baseUrl}/api/profile?${queryString}`;
//     return camelizeKeys(await fetchJson('fetchProfile', url)) as IProfilesResult;
// }

export async function fetchMatches(params: IFetchMatchesParams) {
    console.log('fetchMatches', params);
    const queryString = makeQueryString(decamelizeKeys({
        ...removeReactQueryParams(params),
        page: params.pageParam || 1,
    }));
    const url = `${baseUrl}/api/matches?${queryString}`;
    return camelizeKeys(await fetchJson('fetchMatches', url)) as IMatchesResult;
}

export async function fetchLeaderboard(params: IFetchLeaderboardParams) {
    console.log('fetchLeaderboard', params);
    const queryString = makeQueryString(decamelizeKeys({
        ...removeReactQueryParams(params),
        page: params.pageParam || 1,
    }));
    const url = `${baseUrl}/api/leaderboards/${params.leaderboardId}?${queryString}`;
    return camelizeKeys(await fetchJson('fetchLeaderboard', url)) as ILeaderboard;
}

export async function fetchLeaderboards() {
    const url = `${baseUrl}/api/leaderboards`;
    return camelizeKeys(await fetchJson('fetchLeaderboards', url)) as ILeaderboardDef[];
}

