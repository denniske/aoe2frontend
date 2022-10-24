import React, {Fragment, useEffect, useState} from "react";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";
import {flatten} from "next/dist/shared/lib/flatten";
import Link from "next/link";
import {differenceInSeconds, parseISO} from "date-fns";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faChevronDown, faChevronRight, faCrown, faSkull} from "@fortawesome/free-solid-svg-icons";
import {ILeaderboardDef, ILobbiesMatch, IMatchesMatch, IMatchesMatchPlayer} from "../helper/api.types";
import {fetchLeaderboards} from "../helper/api";
import {formatAgo} from "../helper/util";
import {gql} from "graphql-request";
import { GRAPHQL_TRANSPORT_WS_PROTOCOL } from 'graphql-ws';
import {GraphQLWebSocketClientCustom} from "../other/graphql-ws";
import {applyPatch} from "fast-json-patch";
import {camelizeKeys} from "humps";
import {orderBy, sortBy} from "lodash";

import {ICloseEvent, w3cwebsocket} from "websocket";
import produce from "immer"

interface IConnectionHandler {
    onOpen?: () => void;
    onMatches?: (_matches: any[]) => void;
    onClose?: (event: ICloseEvent) => void;
}

function initConnection(handler: IConnectionHandler): Promise<void> {
    return new Promise(resolve => {
        const client = new w3cwebsocket(`wss://aoe2backend-socket.deno.dev/listen/ongoing-matches`);

        client.onopen = () => {
            console.log('WebSocket client connected');
            handler.onOpen?.();
            resolve();
        };

        client.onmessage = (messageEvent) => {
            const message = JSON.parse(messageEvent.data as string);
            if (message.type != 'pong') {
                handler.onMatches?.(message);
            }
        };

        client.onerror = (error) => {
            console.log('WebSocket client error', error);
        };

        client.onclose = (event: ICloseEvent) => {
            console.log('WebSocket client closed', event);
            handler.onClose?.(event);
        };
    });
}

interface IMatchAddedEvent {
    type: 'matchAdded';
    data: IMatchesMatch;
}

interface IMatchUpdatedEvent {
    type: 'matchUpdated';
    data: IMatchesMatch;
}

interface IMatchRemovedEvent {
    type: 'matchRemoved';
    data: { matchId: number; };
}

type IMatchEvent = IMatchAddedEvent | IMatchUpdatedEvent | IMatchRemovedEvent;

export function initMatchSubscription(handler: IConnectionHandler): Promise<void> {
    let _matches: any[] = [];

    return initConnection({
        onOpen: handler.onOpen,
        onClose: handler.onClose,
        onMatches: (events: IMatchEvent[]) => {
            _matches = produce(_matches, matches => {
                for (const event of events) {
                    const match = matches.find(match => match.matchId == event.data.matchId);

                    switch (event.type) {
                        case 'matchAdded':
                            matches.push(event.data);
                            break;
                        case 'matchUpdated':
                            Object.assign(match, event.data);
                            break;
                        case 'matchRemoved':
                            matches.splice(matches.indexOf(match), 1);
                            break;
                    }
                }
            })
            handler.onMatches?.(_matches);
        }});
}


export default function LobbyPage() {
    const [search, setSearch] = useState('');

    return (
        <div className="flex flex-col">

            <div className="flex flex-col my-3 space-y-1">
                <div className="text-lg">
                    Ongoing Matches
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

            <PlayerList search={search} />
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
        // console.log(finished, match.started)
        duration = formatDuration(differenceInSeconds(finished, match.started) * getSpeedFactor(match.speed as AoeSpeed));
    }
    return duration;
}


export function PlayerList({search}: { search: string }) {
    const [matches, setMatches] = useState<ILobbiesMatch[]>([]);
    const [filteredMatches, setFilteredMatches] = useState<ILobbiesMatch[]>([]);
    const [expandedDict, setExpandedDict] = useState<{ [key: string]: boolean }>({});
    const [connected, setConnected] = useState(false);
    const [listSize, setListSize] = useState(20);

    const toggleExpanded = (matchId: number) => {
      expandedDict[matchId] = !expandedDict[matchId];
      setExpandedDict({...expandedDict});
    };

    const connect = async () => {
        await initMatchSubscription({
            onOpen: () => {
                setConnected(true);
            },
            onClose: () => {
                setConnected(false);
            },
            onMatches: (_lobbies: any[]) => {
                setMatches(_lobbies);
            }
        });
    };

    useEffect(() => {
        connect();
    }, []);

    useEffect(() => {
        const parts = search.toLowerCase().split(' ');
        let filtered = matches.filter((match) => {
            if (search === '') return true;
            return parts.every(part => {
                return match.name.toLowerCase().includes(part.toLowerCase()) ||
                       match.mapName.toLowerCase().includes(part.toLowerCase()) ||
                       match.gameModeName.toLowerCase().includes(part.toLowerCase()) ||
                       match.server.toLowerCase().includes(part.toLowerCase()) ||
                       match.players.some((player) => player.name?.toLowerCase().includes(part.toLowerCase()));
                });
        });
        filtered = orderBy(filtered, m => m.started, 'desc');
        setFilteredMatches(filtered);
    }, [matches, search]);

    // console.log('data', data);

    const handleSpectate = (e: React.MouseEvent<HTMLButtonElement>, matchId: number) => {
        window.location.href = `aoe2de://1/${matchId}`;
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className="flex flex-col">

            <div className="flex flex-row my-4 text-sm text-gray-500">
                <div>There are {matches?.length} ongoing matches. Click on a row to show player list</div>
                <div className="flex-1"></div>
                {/*{*/}
                {/*    connected &&*/}
                {/*    <div className="text-blue">Connected. Refreshes every 10s.</div>*/}
                {/*}*/}
                {
                    !connected &&
                    <div className="text-blue hover:underline" onClick={connect}>Connection lost. Reconnect.</div>
                }
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
                        Avg Rating
                    </th>
                    <th scope="col" className="py-3 px-6">
                        Server
                    </th>
                    <th scope="col" className="py-3 px-6">

                    </th>
                </tr>
                </thead>
                <tbody>
                {
                    filteredMatches?.filter((m, i) => i < listSize).map((match, index) =>
                        <Fragment key={match.matchId}>
                            <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                onClick={() => toggleExpanded(match.matchId)}
                            >

                                <td className="py-4 pl-6">
                                    <FontAwesomeIcon
                                        icon={expandedDict[match.matchId] ? faChevronDown : faChevronRight}
                                        className="w-6 h-6"
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
                                            <div>{formatMatchDuration(match as any)}</div>
                                        </div>
                                    </div>

                                </td>
                                <td className="py-4 px-6">
                                    {match.gameModeName}
                                </td>
                                <td className="py-4 px-6">
                                    ~{match.averageRating?.toFixed(0)}
                                </td>
                                <td className="py-4 px-6">
                                    {match.server}
                                </td>
                                <td className="py-4 px-6">
                                    <button className="bg-blue-500 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-2 px-4 rounded"
                                            onClick={(e) => handleSpectate(e, match.matchId)}
                                    >Spectate</button>
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

            <div className="flex flex-row justify-center p-4">
                <button
                    className="btn btn-primary"
                    onClick={() => setListSize(listSize + 10)}
                    disabled={filteredMatches?.length <= listSize}
                >
                    {filteredMatches?.length === 0 ? 'Fetching...' : filteredMatches?.length > listSize
                        ? 'Show More'
                        : 'Nothing more to show'}
                </button>
            </div>
        </div>
    );
}


interface Props {
    player: IMatchesMatchPlayer;
}

export function Player({ player }: Props) {
    return (
        <div className="flex flex-row space-x-2 items-center">
            <div className="w-[16px]">
                {
                    player.won === true && player.team != -1 &&
                    <FontAwesomeIcon icon={faCrown} className="w-[16px]" color="goldenrod" />
                }
                {
                    player.won === false && player.team != -1 &&
                    <FontAwesomeIcon icon={faSkull} className="w-[16px]" color="grey" />
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
                            <img src={player.civImageUrl} className="w-[18px]"/>
                            <div className="w-[100px] truncate">{player.civName}</div>
                        </>
                    }
                </div>
            </Link>
        </div>
    )
}

