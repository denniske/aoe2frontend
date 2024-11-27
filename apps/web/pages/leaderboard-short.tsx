import {useState} from "react";
import {fetchLeaderboard, fetchLeaderboards} from "@/helper/api";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {ILeaderboardDef} from "@/helper/api.types";
import {flatten} from "lodash";
import {bgColor} from "@/components/style.utils";


export default function Index() {
    const [leaderboard, setLeaderboard] = useState(null);

    const {
        data,
    } = useQuery(['leaderboards'], () => fetchLeaderboards(), {
        onSuccess: (data) => {
            setLeaderboard(x => x || data[0]);
        },
    });

    // console.log('data', data);

    return (
        <div className="flex flex-col">

            <div className="flex flex-row items-center pb-4">
                <div className="">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative mt-1">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true" fill="currentColor"
                                 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                      clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <input type="text" id="table-search"
                               className="block p-2 pl-10 w-80 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="Search for player"/>
                    </div>
                </div>

                <div className="flex-1"></div>

                <div className="flex flex-row space-x-6 cursor-pointer hover:underline">
                    {
                        data?.map((leaderboard: ILeaderboardDef) => (
                            <div key={leaderboard.leaderboardId} className="flex flex-col"
                                 onClick={() => setLeaderboard(leaderboard)}>
                                {leaderboard.abbreviation}
                            </div>
                        ))
                    }
                </div>
            </div>

            {
                leaderboard && (
                    <PlayerList leaderboard={leaderboard}/>
                )
            }
        </div>
    );
}

export function PlayerList({leaderboard}: { leaderboard: ILeaderboardDef }) {
    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isFetchingNextPage,
        status,
    } = useInfiniteQuery(
        ['leaderboard-players', leaderboard.leaderboardId],
        (context) => fetchLeaderboard({...context, leaderboardId: context.queryKey[1] as number,}), {
            getNextPageParam: (lastPage, pages) => lastPage.page + 1,
            keepPreviousData: true,
        })

    console.log('data', data);

    return (
        <div className="flex flex-col">

            <table className={`w-full text-sm text-left ${bgColor.subtle} text-gray-500 dark:text-gray-400`}>
                <thead className={`text-xs text-gray-700 uppercase ${bgColor.subtle} dark:text-gray-400`}>
                <tr>
                    <th scope="col" className="py-3 px-6">
                        Name
                    </th>
                    <th scope="col" className="py-3 px-6">
                        Color
                    </th>
                    <th scope="col" className="py-3 px-6">
                        Category
                    </th>
                    <th scope="col" className="py-3 px-6">
                        Price
                    </th>
                    <th scope="col" className="py-3 px-6">
                        Action
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    flatten(data?.pages?.map(p => p.players) || []).map((player, index) =>
                        <tr key={player.profileId} className={`bg-white border-b ${bgColor.default} dark:border-gray-700`}>
                            <th scope="row"
                                className="py-4 px-6 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {player.name}
                            </th>
                            <td className="py-4 px-6">
                                Sliver
                            </td>
                            <td className="py-4 px-6">
                                Laptop
                            </td>
                            <td className="py-4 px-6">
                                $2999
                            </td>
                            <td className="py-4 px-6">
                                <a href="#"
                                   className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>

            <div>
                <button
                    onClick={() => fetchNextPage()}
                    disabled={!hasNextPage || isFetchingNextPage}
                >
                    {isFetchingNextPage
                        ? 'Loading more...'
                        : hasNextPage
                            ? 'Load More'
                            : 'Nothing more to load'}
                </button>
            </div>
            <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>


        </div>
    );
}
