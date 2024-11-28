"use client";

import {useState} from "react";
import {keepPreviousData, useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {flatten} from "lodash";
import Link from "next/link";
import {fetchLeaderboards, fetchMatches, fetchProfile} from "@/helper/api";
import {ILeaderboardDef, IMatchesMatch, IPlayerNew, IProfileLeaderboardResult, ITeamNew} from "@/helper/api.types";
import useDebounce from "@/hooks/use-debounce";
import {formatAgo} from "@/helper/util";
import {differenceInSeconds, format} from "date-fns";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChartLine, faCheckCircle, faCrown, faSkull} from "@fortawesome/free-solid-svg-icons";
import Rating from "@/components/rating";
import Tabs from "@/components/tabs";
import {classNames} from "@/components/global-search";
import LocalSearch from "@/components/local-search";
import {bgColor, borderColor, textColor} from "@/components/style.utils";
import {useParams} from "next/navigation";


export default function ProfilePage() {
    const params = useParams<{ profileId: string }>()
    const profileId = params?.profileId ? parseInt(params.profileId) : undefined;
    const [leaderboard, setLeaderboard] = useState<ILeaderboardDef>();
    const [search, setSearch] = useState('');

    const leaderboards = useQuery({
        queryKey: ['leaderboards'],
        queryFn: () => fetchLeaderboards(),
    });


    // const ratings = useQuery(['ratings', profileId], (context) => {
    //     return fetchProfileRatings({
    //         ...context,
    //         profileId: context.queryKey[1] as number,
    //     });
    // }, {enabled: !!profileId});

    // const leaderboardRows = useQuery(['leaderboardRows', profileId], (context) => {
    //     return fetchProfileRatings({
    //         ...context,
    //         profileId: context.queryKey[1] as number,
    //     });
    // }, {
    //     enabled: !!profileId,
    // });

    // const profile = useQuery(['profile', profileId], () => fetchProfile());

    const profile = useQuery({
        queryKey: ['profile', profileId],
        queryFn: (context) => {
            return fetchProfile({
                ...context,
                profileId: profileId,
            });
        },
        enabled: !!profileId
    });

    // console.log('profileId', profileId);
    // console.log('enabled', !!profileId);
    // console.log('profile?.data', profile?.data);

    if (!(leaderboards?.data && profileId && profile?.data)) {
        return <div></div>;
    }

    const follow = async () => {
        fetch('https://api.aoe2companion.com/follow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({profileId: profileId}),
        }).then(response => {
            if (response.ok) {
                console.log('followed');
            }
        })
    };

    // console.log('leaderboard', leaderboard);

    return (
        <div className="flex flex-col">

            <div className="flex flex-col ml-6 space-y-1">
                <div className="flex flex-row items-center text-lg">
                    <span style={{fontSize: 26}} className="mr-2">{profile?.data?.countryIcon + ' '}</span>
                    {profile?.data?.name}
                    <span className="ml-1">
                    {profile?.data?.verified &&
                        <FontAwesomeIcon
                            className={classNames(
                                'w-4 ml-1 text-[#397AF9]',
                            )}
                            icon={faCheckCircle}/>
                    }
                    </span>

                    <button onClick={follow}>FOLLOW THIS USER</button>

                </div>
                <div className="text-md ml-9">
                    {profile?.data?.games} games
                </div>
            </div>

            <br/>


            <div className="flex flex-col w-full lg:flex-row gap-4 lg:gap-8 mb-4 md:mb-6">

                {
                    profile?.data?.leaderboards.filter(l => l.rank).map((leaderboardDef: IProfileLeaderboardResult) => (

                        <div key={leaderboardDef.leaderboardId}
                             className={`flex-auto ${bgColor.default} overflow-visible border ${borderColor.default} rounded-2xl px-4 py-4 flex flex-wrap gap-6 justify-center group only:items-center only:justify-start only:px-8`}>
                            <div
                                className={`${textColor.subtle} uppercase font-bold flex-none w-full sm:w-auto lg:w-full text-center group-only:w-auto`}>
                                {leaderboardDef.leaderboardName}
                            </div>
                            {
                                leaderboardDef.rank &&
                                <>
                                    <div
                                        className="flex-auto basis-auto flex gap-4 justify-center lg:basis-full text-center group-only:basis-1/12">
                                        <div className="flex-none">
                                            <div
                                                className={`${textColor.subtle} uppercase text-xs font-bold tracking-widest mb-1`}>Rank
                                            </div>
                                            <div className="inline-flex inline-flex items-center">
                                                <div className="text-xl lg:text-4xl"><span
                                                    className="mr-1">#</span><span>{leaderboardDef.rank}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-auto justify-evenly flex flex-wrap gap-y-6 gap-x-4">
                                        <div className="flex-none text-center"><h5
                                            className={`${textColor.subtle} uppercase text-xs font-bold tracking-widest mb-1`}>Rating</h5>
                                            <div className="text-xl lg:text-2xl">{leaderboardDef.rating}</div>
                                        </div>
                                        <div className="flex-none text-center"><h5
                                            className={`${textColor.subtle} uppercase text-xs font-bold tracking-widest mb-1`}>Win
                                            Rate</h5>
                                            <div
                                                className="text-xl lg:text-2xl">{(leaderboardDef.wins / (leaderboardDef.wins + leaderboardDef.losses) * 100).toFixed(0)} %
                                            </div>
                                        </div>
                                        <div className="flex-none text-center"><h5
                                            className={`${textColor.subtle} uppercase text-xs font-bold tracking-widest mb-1`}>Games</h5>
                                            <div
                                                className="text-xl lg:text-2xl">{leaderboardDef.wins + leaderboardDef.losses}</div>
                                        </div>
                                    </div>
                                </>
                            }
                        </div>
                    ))
                }

            </div>


            <div className={`overflow-hidden ${bgColor.default} border ${borderColor.default} sm:rounded-lg sm:shadow`}>

                <div className={`border-b ${borderColor.default} px-4 py-5 sm:px-6`}>
                    <h3 className="flex flex-row space-x-4 text-lg font-medium leading-6">
                        <FontAwesomeIcon icon={faChartLine} className="w-4"/>
                        <span>Rating History</span>
                    </h3>
                </div>

                <div role="list" className="px-6 py-7">

                    {
                        profile?.data?.ratings &&
                        <Rating ratingHistories={profile?.data?.ratings}/>
                    }

                </div>
            </div>


            <br/>


            <div className="flex flex-row items-center pb-4">
                {/*<div className="">*/}
                {/*    <label htmlFor="table-search" className="sr-only">Search</label>*/}
                {/*    <div className="relative mt-1">*/}
                {/*        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">*/}
                {/*            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true"*/}
                {/*                 fill="currentColor"*/}
                {/*                 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">*/}
                {/*                <path fillRule="evenodd"*/}
                {/*                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"*/}
                {/*                      clipRule="evenodd"></path>*/}
                {/*            </svg>*/}
                {/*        </div>*/}
                {/*        <input type="text" id="table-search"*/}
                {/*               className="block p-2 pl-10 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"*/}
                {/*               placeholder="Search for player"*/}
                {/*               onChange={(e) => {*/}
                {/*                   setSearch(e.target.value)*/}
                {/*               }}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</div>*/}

                <div className="flex-1"></div>

                <Tabs tabs={
                    [
                        {
                            name: 'All',
                            current: leaderboard == null,
                            onClick: () => setLeaderboard(undefined),
                        },
                        ...leaderboards?.data?.map((leaderboardDef: ILeaderboardDef) => ({
                            name: leaderboardDef.abbreviation,
                            current: leaderboardDef.leaderboardId === leaderboard?.leaderboardId,
                            onClick: () => setLeaderboard(leaderboardDef),
                        })),
                    ]
                }/>


                {/*<div className="flex flex-row space-x-6">*/}
                {/*    {*/}
                {/*        leaderboards?.data?.map((leaderboardDef: ILeaderboardDef) => (*/}
                {/*            <div key={leaderboardDef.leaderboardId}*/}
                {/*                 className={`flex flex-col  cursor-pointer hover:underline*/}
                {/*                            ${leaderboardDef.leaderboardId === leaderboard?.leaderboardId ? 'font-bold' : ''}*/}
                {/*                 `}*/}
                {/*                 onClick={() => setLeaderboard(leaderboardDef)}>*/}
                {/*                {leaderboardDef.abbreviation}*/}
                {/*            </div>*/}
                {/*        ))*/}
                {/*    }*/}
                {/*</div>*/}
            </div>

            <LocalSearch className="w-full" placeholder="Search for match name, map, player" query={search}
                         setQuery={setSearch}></LocalSearch>

            <br/>

            {
                profileId && profile?.data && (
                    <PlayerList leaderboard={leaderboard} search={search} profileId={profileId}/>
                )
            }
        </div>
    );
}

export type AoeSpeed = 0 | 1 | 2 | 3;

const speedFactorDict = {
    0: 1.0,
    1: 1.5,
    2: 1.7,
    3: 2.0,
}

export function getSpeedFactor(speed: AoeSpeed) {
    if (speed == null) return 1;
    return speedFactorDict[speed];
}

const formatDuration = (durationInSeconds: number) => {
    if (!durationInSeconds) return '00:00'; // divide by 0 protection
    const minutes = Math.abs(Math.floor(durationInSeconds / 60) % 60).toString();
    const hours = Math.abs(Math.floor(durationInSeconds / 60 / 60)).toString();
    return `${hours.length < 2 ? hours : hours}:${minutes.length < 2 ? 0 + minutes : minutes} h`;
};

function formatMatchDuration(match: IMatchesMatch) {
    let duration: string = '';
    if (match.finished) {
        return formatAgo(match.started);
    }
    if (match.started) {
        const finished = match.finished || new Date();
        duration = formatDuration(differenceInSeconds(finished, match.started) * getSpeedFactor(match.speed as AoeSpeed));
    }
    return duration;
}

function formatMatchDuration2(match: IMatchesMatch) {
    let duration: string = '';
    if (match.started) {
        const finished = match.finished || new Date();
        duration = formatDuration(differenceInSeconds(finished, match.started) * getSpeedFactor(match.speed as AoeSpeed));
    }
    return duration;
}


export function PlayerList({
                               leaderboard,
                               search,
                               profileId
                           }: { leaderboard?: ILeaderboardDef, search: string, profileId: number }) {
    const debouncedSearch = useDebounce(search, 600);

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['matches', profileId, debouncedSearch, leaderboard?.leaderboardId],
        queryFn: (context) => {
            return fetchMatches({
                ...context,
                profileIds: [context.queryKey[1] as number],
                search: context.queryKey[2] as string,
                leaderboardIds: [context.queryKey[3] as number],
            });
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => lastPage.matches.length === lastPage.perPage ? lastPage.page + 1 : null,
        placeholderData: keepPreviousData,
    })

    console.log('data', data);

    const sortTeamByCurrentPlayer = (teams: ITeamNew[]) => {
        const focusIndex = teams.findIndex(team => team.players.some(player => player.profileId === profileId));
        return [
            teams[focusIndex],
            ...teams.slice(0, focusIndex),
            ...teams.slice(focusIndex + 1, teams.length),
        ]
    };

    return (
        <div
            className={`overflow-hidden ${bgColor.subtle} text-gray-500 dark:text-gray-400 sm:rounded-lg sm:shadow`}>
            <div className="flex flex-col">

                <table className="w-full text-sm text-left text-gray-700 dark:text-gray-400">
                    <thead className={`text-xs text-gray-700 uppercase ${bgColor.subtle} dark:text-gray-400`}>
                    <tr>
                        <th scope="col" className="py-3 px-6">
                            Map / Mode / Duration
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Players
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        flatten(data?.pages?.map(p => p.matches) || []).map((match, index) =>
                            <tr key={match.matchId}
                                className={`bg-white border-b ${bgColor.default} dark:border-gray-700`}>
                                <td className="py-4 px-6">

                                    <div className="flex flex-row space-x-4 items-center w-[200px]">
                                        <img src={match.mapImageUrl} className="w-16 h-16"/>

                                        <div className="flex flex-col">
                                            <div className="text-sm text-gray-400">
                                                {match.matchId}
                                            </div>
                                            <div className="font-bold">
                                                {match.mapName}
                                            </div>
                                            <div>{match.leaderboardName}</div>
                                            <div title={format(match.started, 'Pp')}>{formatMatchDuration(match)}</div>
                                            {
                                                match.finished &&
                                                <div>{formatMatchDuration2(match)}</div>
                                            }
                                        </div>
                                    </div>

                                </td>
                                <td className="py-4 px-6">
                                    {
                                        match.teams.length == 2 &&
                                        <div className="flex flex-row space-x-4">
                                            {
                                                sortTeamByCurrentPlayer(match.teams).map((team, index) => (
                                                    <div key={team.teamId}
                                                         className="flex flex-row items-center space-x-3">
                                                        <div className="flex flex-col space-y-3">
                                                            {
                                                                team.players.map((player) => (
                                                                    <Player key={player.slot}
                                                                            bold={player.profileId == profileId}
                                                                            player={player} reversed={index % 2 == 0}/>
                                                                ))
                                                            }
                                                        </div>
                                                        {
                                                            index < match.teams.length - 1 &&
                                                            <div className="">
                                                                <div className="">VS</div>
                                                            </div>
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    }
                                    {
                                        match.teams.length != 2 &&
                                        <div className="flex flex-col space-y-4">
                                            {
                                                sortTeamByCurrentPlayer(match.teams).map((team, index) => (
                                                    <div key={team.teamId} className="flex flex-col space-y-3">
                                                        <div className="flex flex-col space-y-3">
                                                            {
                                                                team.players.map((player) => (
                                                                    <Player key={player.slot}
                                                                            bold={player.profileId == profileId}
                                                                            player={player} reversed={true}/>
                                                                ))
                                                            }
                                                        </div>
                                                        {
                                                            index < match.teams.length - 1 &&
                                                            <div className="">
                                                                <div className="">VS</div>
                                                            </div>
                                                        }
                                                    </div>
                                                ))
                                            }
                                        </div>
                                    }
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                </table>

                <div className="flex flex-row justify-center p-4">
                    <button
                        className="btn btn-primary"
                        onClick={() => fetchNextPage()}
                        disabled={!hasNextPage || isFetchingNextPage}
                    >
                        {isFetchingNextPage
                            ? 'Loading more...'
                            : hasNextPage
                                ? 'Load More'
                                : 'Nothing more to load'}
                    </button>
                    <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>
                </div>

            </div>
        </div>
    );
}

function signed(number: number, reversed: boolean = false) {
    if (number == null) return '';
    if (reversed) {
        return number > 0 ? number + ' ↑' : Math.abs(number) + ' ↓';

    } else {
        return number > 0 ? '↑ ' + number : '↓ ' + Math.abs(number);

    }
}

interface Props {
    player: IPlayerNew;
    reversed: boolean;
    bold: boolean;
}

export function Player({player, reversed, bold}: Props) {
    const alpha = bold ? '33' : '33';
    const bb = bold ? '#777' : '#EEE';
    if (reversed) {
        return (
            <div className={`flex flex-row space-x-2 max-w-[400px] items-center border border-1 p-2 rounded`}
                 style={{
                     borderColor: bb,
                     background: `linear-gradient(to right, ${player.colorHex + alpha}, #00000000)`
                 }}>
                <Link className="flex flex-row space-x-1 items-center" href='/profile/[profileId]'
                      as={`/profile/${player.profileId}`}>
                    <img src={player.civImageUrl} className="w-[18px]"/>
                    <div className="w-[100px] truncate text-left">{player.civName}</div>
                </Link>
                <Link
                    className={`flex flex-row w-[150px] truncate cursor-pointer ${bold && ' '} text-left hover:underline`}
                    href='/profile/[profileId]'
                    as={`/profile/${player.profileId}`}>
                    {player.name}
                    {player.verified &&
                        <FontAwesomeIcon
                            className={classNames(
                                'w-3.5 mx-1 text-[#AAA]',
                            )}
                            icon={faCheckCircle}/>
                    }
                </Link>
                <div className="w-9">{player.rating}</div>
                <div className="w-9 text-right" style={{
                    color: player.ratingDiff > 0 ? '#22c55e' : '#ef4444',
                    fontVariant: 'tabular-nums',
                    font: '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
                }}>{signed(player.ratingDiff, reversed)}</div>

                <div className="w-[16px]">
                    {
                        player.won === true && player.team != -1 &&
                        <FontAwesomeIcon icon={faCrown} className="w-[16px]" color="goldenrod"/>
                    }
                    {
                        player.won === false && player.team != -1 &&
                        <FontAwesomeIcon icon={faSkull} className="w-[16px]" color="grey"/>
                    }
                </div>
            </div>
        )
    }
    return (
        <div className={`flex flex-row space-x-2 max-w-[400px] items-center border border-1 p-2 rounded`}
             style={{borderColor: bb, background: `linear-gradient(to left, ${player.colorHex + alpha}, #00000000)`}}>
            <div className="w-[16px]">
                {
                    player.won === true && player.team != -1 &&
                    <FontAwesomeIcon icon={faCrown} className="w-[16px]" color="goldenrod"/>
                }
                {
                    player.won === false && player.team != -1 &&
                    <FontAwesomeIcon icon={faSkull} className="w-[16px]" color="grey"/>
                }
            </div>

            <div className="w-9" style={{
                color: player.ratingDiff > 0 ? '#22c55e' : '#ef4444',
                fontVariant: 'tabular-nums',
                font: '14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            }}>{signed(player.ratingDiff, !reversed)}</div>
            <div className="w-9">{player.rating}</div>
            <Link
                className={`flex flex-row w-[150px] truncate cursor-pointer ${bold && ' '} text-right hover:underline`}
                href='/profile/[profileId]'
                as={`/profile/${player.profileId}`}>
                {player.name}
                {player.verified &&
                    <FontAwesomeIcon
                        className={classNames(
                            'w-3.5 mx-1 text-[#AAA]',
                        )}
                        icon={faCheckCircle}/>
                }
            </Link>
            <Link className="flex flex-row space-x-1 items-center" href='/profile/[profileId]'
                  as={`/profile/${player.profileId}`}>
                <div className="w-[100px] truncate text-right">{player.civName}</div>
                <img src={player.civImageUrl} className="w-[18px]"/>
            </Link>
        </div>
    )
}

