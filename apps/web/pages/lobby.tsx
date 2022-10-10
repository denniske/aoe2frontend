import {Fragment, useEffect, useState} from "react";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {flatten} from "next/dist/shared/lib/flatten";
import Link from "next/link";
import {differenceInSeconds} from "date-fns";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronRight, faCrown, faSkull} from "@fortawesome/free-solid-svg-icons";
import {ILeaderboardDef, ILobbiesMatch, IMatchesMatch, IMatchesMatchPlayer} from "../helper/api.types";
import useDebounce from "../hooks/use-debounce";


import {gql} from "graphql-request";
import { GRAPHQL_TRANSPORT_WS_PROTOCOL } from 'graphql-ws';
import {GraphQLWebSocketClientCustom} from "../other/graphql-ws";
import {fetchLeaderboards, fetchProfile} from "../helper/api";
import {data} from "autoprefixer";
import {formatAgo} from "../helper/util";
import {applyPatch, generate, observe, Observer} from "fast-json-patch";
import {camelizeKeys} from "humps";

async function createClient(url: string) {
    return new Promise<GraphQLWebSocketClientCustom>((resolve, reject) => {
        // const socket = new WebSocketImpl(url, GRAPHQL_TRANSPORT_WS_PROTOCOL);
        const socket = new WebSocket(url, GRAPHQL_TRANSPORT_WS_PROTOCOL);
        const client: GraphQLWebSocketClientCustom = new GraphQLWebSocketClientCustom((socket as unknown) as WebSocket, {
            onAcknowledged: async (_p) => {
                console.log('ACKNOWLEDGED');
                resolve(client);
            },
            onClose: () => {
                reject();
            },
        })
    })
}

async function doListen(onChange: (data: any) => void, onReset: () => void) {
    try {
        console.log('LISTENING');

        const url = `ws://localhost:3334/graphql`;
        // const url = `wss://graph.aoe2companion.com/graphql`;

        const client = await createClient(url)
        const result = await new Promise<string>((resolve, reject) => {
            const allGreatings = 'test';
            client.subscribe<{ lobbiesUpdatedSub: any }>(
                gql`subscription lobbiesUpdatedSub {
                    lobbiesUpdatedSub
                }`,
                {
                    next: ({ lobbiesUpdatedSub }) => {
                        onChange(JSON.parse(lobbiesUpdatedSub));
                    },
                    complete: () => { resolve(allGreatings) },
                    error: (e) => { reject(e) }
                })
        })
        client.close();
        console.log('Connection complete. Reconnecting in 10s', result);
        onReset();
        setTimeout(() => doListen(onChange), 10 * 1000);
    } catch (e) {
        console.log(e);
        console.log('Connection Error. Reconnecting in 10s');
        // sendAlert('notify', e)
        onReset();
        setTimeout(() => doListen(onChange), 10 * 1000);
    }
}


export default function LobbyPage() {
    const [leaderboard, setLeaderboard] = useState(null);
    const [search, setSearch] = useState('');

    const leaderboards = useQuery(['matches'], () => fetchLeaderboards(), {
        onSuccess: (data) => {
            setLeaderboard(data[0]);
        },
    });

    return (
        <div className="flex flex-col">

            <div className="flex flex-col my-3 space-y-1">
                <div className="text-lg">
                    Lobbies
                </div>
            </div>

            <div className="flex flex-row items-center">
                <div className="w-full">
                    <label htmlFor="table-search" className="sr-only">Search</label>
                    <div className="relative mt-1">
                        <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                            <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" aria-hidden="true"
                                 fill="currentColor"
                                 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd"
                                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                      clipRule="evenodd"></path>
                            </svg>
                        </div>
                        <input type="text" id="table-search"
                               className="block p-2 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="Search for name, map, game mode, server, player name"
                               onChange={(e) => {
                                   setSearch(e.target.value)
                               }}
                        />
                    </div>
                </div>
            </div>

            {
                leaderboard && (
                    <PlayerList leaderboard={leaderboard} search={search} />
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


export function PlayerList({
                               leaderboard,
                               search,
                           }: { leaderboard: ILeaderboardDef, search: string }) {
    const [lobbiesDict, setLobbiesDict] = useState<any>({});
    const [data, setData] = useState<ILobbiesMatch[]>([]);
    const [filteredData, setFilteredData] = useState<ILobbiesMatch[]>([]);
    const [expandedDict, setExpandedDict] = useState<{ [key: string]: boolean }>({});

    const toggleExpanded = (matchId: number) => {
      expandedDict[matchId] = !expandedDict[matchId];
      setExpandedDict({...expandedDict});
    };

    useEffect(() => {
        doListen(
            (patch) => {
                try {
                    console.log('lobbiesDict', lobbiesDict);
                    console.log('patch', patch);
                    const newDoc = applyPatch(lobbiesDict, patch);
                    setLobbiesDict(camelizeKeys(newDoc.newDocument));
                } catch (e) {
                    console.log(e);
                }
            },
            () => {
                setData([]);
            },
            );
    }, []);

    useEffect(() => {
        setData(Object.values(lobbiesDict) as ILobbiesMatch[]);
    }, [lobbiesDict]);

    useEffect(() => {
        const filtered = data.filter((match) => {
            if (search === '') return true;
            return match.name.toLowerCase().includes(search.toLowerCase()) ||
                   match.mapName.toLowerCase().includes(search.toLowerCase()) ||
                   match.gameModeName.toLowerCase().includes(search.toLowerCase()) ||
                   match.server.toLowerCase().includes(search.toLowerCase()) ||
                   match.players.some((player) => player.name?.toLowerCase().includes(search.toLowerCase()));
        });
        setFilteredData(filtered);
    }, [data, search]);

    console.log('data', data);

    return (
        <div className="flex flex-col">

            <div className="my-4 text-sm text-gray-500">
                <span>There are {data?.length} open lobbies. </span>
                Click on a row to show player list
            </div>

            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="py-3 px-6">

                    </th>
                    <th scope="col" className="py-3 px-6">
                        Map / Mode / Duration
                    </th>
                    <th scope="col" className="py-3 px-6">
                        Game Mode
                    </th>
                    <th scope="col" className="py-3 px-6">
                        Rating
                    </th>
                    <th scope="col" className="py-3 px-6">
                        Server
                    </th>
                    <th scope="col" className="py-3 px-6">
                        Status
                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    // flatten(data?.pages?.map(p => p.matches) || []).map((match, index) =>
                    filteredData?.map((match, index) =>
                        <Fragment key={match.matchId}>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                onClick={() => toggleExpanded(match.matchId)}
                            >

                                <td className="py-4 px-6">
                                    <FontAwesomeIcon
                                        icon={expandedDict[match.matchId] ? faChevronDown : faChevronRight}
                                        className="w-8 h-8"
                                        color="grey"
                                    />
                                </td>
                                <td className="py-4 px-6">

                                    <div className="flex flex-row space-x-4 items-center w-[200px]">
                                        <img src={match.mapImageUrl} className="w-16 h-16"/>

                                        <div className="flex flex-col">
                                            <div className="font-bold">
                                                {match.mapName}
                                            </div>
                                            <div>{match.name}</div>
                                        </div>
                                    </div>

                                </td>
                                <td className="py-4 px-6">
                                    {match.gameModeName}
                                </td>
                                <td className="py-4 px-6">
                                    {match.averageRating?.toFixed(0)}
                                </td>
                                <td className="py-4 px-6">
                                    {match.server}
                                </td>
                                <td className="py-4 px-6">
                                    {match.blockedSlotCount} / {match.totalSlotCount}
                                </td>
                            </tr>
                            {
                                expandedDict[match.matchId] && (
                                    <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">

                                        <td className="py-4 px-6">
                                        </td>
                                        <td className="py-4 px-6" colSpan={5}>

                                            <div className="flex flex-row space-x-4">
                                                <div className="flex flex-row items-center space-x-3">
                                                    <div className="flex flex-col space-y-3">
                                                        {
                                                            match.players.map((player, playerIndex) => (
                                                                <Player key={playerIndex} player={player}/>
                                                            ))
                                                        }
                                                    </div>
                                                </div>
                                            </div>

                                        </td>
                                    </tr>
                                )
                            }
                        </Fragment>
                    )
                }
                </tbody>
            </table>

            {/*<div className="flex flex-row justify-center p-4">*/}
            {/*    <button*/}
            {/*        className="btn btn-primary"*/}
            {/*        onClick={() => fetchNextPage()}*/}
            {/*        disabled={!hasNextPage || isFetchingNextPage}*/}
            {/*    >*/}
            {/*        {isFetchingNextPage*/}
            {/*            ? 'Loading more...'*/}
            {/*            : hasNextPage*/}
            {/*                ? 'Load More'*/}
            {/*                : 'Nothing more to load'}*/}
            {/*    </button>*/}
            {/*    <div>{isFetching && !isFetchingNextPage ? 'Fetching...' : null}</div>*/}
            {/*</div>*/}

        </div>
    );
}


interface Props {
    player: IMatchesMatchPlayer;
}

export function Player({ player }: Props) {
    // const boxStyle = {backgroundColor: getPlayerBackgroundColor(player.color)};

    return (
        <div className="flex flex-row space-x-2 items-center">
            <div className="">
                {
                    player.won === true && player.team != -1 &&
                    <FontAwesomeIcon icon={faCrown} color="goldenrod" />
                }
                {
                    player.won === false && player.team != -1 &&
                    <FontAwesomeIcon icon={faSkull} className="" color="grey" />
                }
            </div>

            <div className="flex flex-row items-center justify-center w-5 h-5 border border-black text-black" style={{ backgroundColor: player.colorHex }}>
                {player.color}
            </div>
            <div className="w-9">{player.rating}</div>
            <Link href='/profile/[profileId]' as={`/profile/${player.profileId}`}>
                <div className="w-[150px] truncate cursor-pointer hover:underline">
                    {player.name}
                </div>
            </Link>
            <Link href='/profile/[profileId]' as={`/profile/${player.profileId}`}>
                <div className="flex flex-row space-x-1 items-center">
                    {
                        player.civ &&
                        <>
                            <img src={player.civImageUrl} className="w-4 h-4"/>
                            <div className="w-[100px] truncate">{player.civName}</div>
                        </>
                    }
                </div>
            </Link>
        </div>
    )
}
