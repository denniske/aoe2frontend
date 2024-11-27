"use client";

import {useEffect, useState} from "react";
import {fetchLeaderboard, fetchLeaderboards} from "@/helper/api";
import {keepPreviousData, useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {flatten} from "lodash";
import {ILeaderboardDef} from "@/helper/api.types";
import useDebounce from "@/hooks/use-debounce";
import Link from "next/link";
import {formatAgo} from "@/helper/util";
import LocalSearch from "@/components/local-search";
import Tabs from "@/components/tabs";
import {bgColor} from "@/components/style.utils";


export default function Index() {
    const [leaderboard, setLeaderboard] = useState<ILeaderboardDef | null>(null);
    const [search, setSearch] = useState('');

    const {
        data,
    } = useQuery({
        queryKey: ['leaderboards'],
        queryFn: () => fetchLeaderboards(),
    });

    useEffect(() => {
        if (data) {
            setLeaderboard(data[0]);
        }
    }, [data]);

    // console.log('data', data);
    // console.log('leaderboard', leaderboard);

    return (
        <div className="flex flex-col">
            <div className="flex flex-col my-3 space-y-1">
                <div className="text-lg">
                    Leaderboard
                </div>
            </div>

            <div className="flex flex-row items-center">

                {/*<div className="">*/}
                {/*    <label htmlFor="table-search" className="sr-only">Search</label>*/}
                {/*    <div className="relative mt-1">*/}
                {/*        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">*/}
                {/*            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor"*/}
                {/*                 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">*/}
                {/*                <path fillRule="evenodd"*/}
                {/*                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"*/}
                {/*                      clipRule="evenodd"></path>*/}
                {/*            </svg>*/}
                {/*        </div>*/}
                {/*        <input type="text" id="table-search"*/}
                {/*               className="block p-2 pl-10 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"*/}
                {/*               placeholder="Search for player"*/}
                {/*               onChange={(e) => { setSearch(e.target.value) }}*/}
                {/*        />*/}
                {/*    </div>*/}
                {/*</div>*/}

                <LocalSearch className="w-60 mr-4" placeholder="Search for player" query={search}
                             setQuery={setSearch}></LocalSearch>

                <div className="flex-1"></div>

                {/*<div className="flex flex-row space-x-6">*/}
                {/*    {*/}
                {/*        data?.map((leaderboardDef: ILeaderboardDef) => (*/}
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

                {
                    data && leaderboard &&
                    <Tabs tabs={
                        [
                            ...data?.map((leaderboardDef: ILeaderboardDef) => ({
                                name: leaderboardDef.abbreviation,
                                current: leaderboardDef.leaderboardId === leaderboard?.leaderboardId,
                                onClick: () => setLeaderboard(leaderboardDef),
                            })),
                        ]
                    }/>
                }

            </div>

            <div className="my-4 text-sm text-gray-500">
                Click on a player name to view their profile and match history
            </div>

            {
                leaderboard && (
                    <PlayerList leaderboard={leaderboard} search={search}/>
                )
            }
        </div>
    );
}

export function PlayerList({leaderboard, search}: { leaderboard: ILeaderboardDef, search: string }) {
    const debouncedSearch = useDebounce(search, 600);

    // console.log('search', search);
    // console.log('leaderboard.leaderboardId', leaderboard.leaderboardId);

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery({
        queryKey: ['leaderboard-players', search, leaderboard.leaderboardId],
        queryFn: (context) => {
            return fetchLeaderboard({
                ...context,
                search: context.queryKey[1] as string,
                leaderboardId: context.queryKey[2] as number,
            });
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage, pages) => lastPage.page + 1,
        placeholderData: keepPreviousData,
        // refetchOnMount: false,
        // staleTime: 10000,
    })

    // console.log('data', data);

    return (
        <div className={`overflow-hidden ${bgColor.subtle} text-gray-500 dark:text-gray-400 sm:rounded-lg sm:shadow`}>
            <div className="flex flex-col">

                <table className={`w-full text-sm text-left ${bgColor.subtle} text-gray-500 dark:text-gray-400`}>
                    <thead className={`text-xs text-gray-700 uppercase ${bgColor.subtle} dark:text-gray-400`}>
                    <tr>
                        <th scope="col" className="py-3 px-6">
                            #
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Name
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Rating
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Wins
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Games
                        </th>
                        <th scope="col" className="py-3 px-6">
                            Last Match
                        </th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        flatten(data?.pages?.map(p => p.players) || []).map((player, index) =>
                            <tr key={player.profileId}
                                className={`bg-white border-b ${bgColor.default} dark:border-gray-700`}>
                                <td className="py-4 px-6">
                                    {player.rank}
                                </td>
                                <th scope="row"
                                    className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <Link className="cursor-pointer hover:underline" href={`/apps/web/app/profile/%5BprofileId%5D/%5BprofileId%5D.tsx`}
                                          as={`/profile/${player.profileId}`}>
                                        {player.name}
                                    </Link>
                                </th>
                                <td className="py-4 px-6">
                                    {player.rating}
                                </td>
                                <td className="py-4 px-6">
                                    {(player.wins / player.games * 100).toFixed(0)} %
                                </td>
                                <td className="py-4 px-6">
                                    {player.games}
                                </td>
                                <td className="py-4 px-6">
                                    {formatAgo(player.lastMatchTime)}
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
