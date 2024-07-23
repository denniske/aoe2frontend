import {AppProps} from 'next/app';
import Head from 'next/head';
import './styles.css';
import Link from "next/link";
import {useState} from "react";
import {Hydrate, QueryClient, QueryClientProvider} from "@tanstack/react-query";
import NoSSRWrapper from "../other/no-ssr-wrapper";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
import GlobalSearch from "../components/global-search";
import {getConfig} from "../helper/config";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';

polyfillCountryFlagEmojis();

const config = getConfig();

function CustomApp({Component, pageProps, router}: AppProps) {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                // refetchOnWindowFocus: false,
            },
        },
    }));

    if (router.pathname.startsWith('/red-bull-wololo-live-standings')) {
        return (
            <>
                <Head>
                    <title>{config.app.name}</title>
                    <link
                        rel="icon"
                        type="image/png"
                        href={`/web/${config.game}/favicon-16x16.png?v=200706014637`}
                        sizes="16x16"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        href={`/web/${config.game}/favicon-32x32.png?v=200706014637`}
                        sizes="32x32"
                    />
                    <link
                        rel="icon"
                        type="image/png"
                        href={`/web/${config.game}/favicon-96x96.png?v=200706014637`}
                        sizes="96x96"
                    />
                </Head>

                <QueryClientProvider client={queryClient}>
                    <Hydrate state={(pageProps as any).dehydratedState}>
                        <NoSSRWrapper>
                            <Component {...pageProps} />
                        </NoSSRWrapper>
                    </Hydrate>
                    {/*<ReactQueryDevtools />*/}
                </QueryClientProvider>
            </>
        );
    }

    return (
        <>
            <Head>
                <title>{config.app.name}</title>
                <link rel="icon" type="image/png" href={`/web/${config.game}/favicon-16x16.png?v=200706014637`} sizes="16x16"/>
                <link rel="icon" type="image/png" href={`/web/${config.game}/favicon-32x32.png?v=200706014637`} sizes="32x32"/>
                <link rel="icon" type="image/png" href={`/web/${config.game}/favicon-96x96.png?v=200706014637`} sizes="96x96"/>
            </Head>

            <QueryClientProvider client={queryClient}>
                <Hydrate state={(pageProps as any).dehydratedState}>
                    <NoSSRWrapper>
                        <main className="flex flex-col items-center">

                            <div className="flex flex-col px-6 py-4 min-h-[100vh] w-full max-w-[1200px] m-x-auto">

                                <div className="flex flex-row space-x-14 mt-4 mb-6 items-center">
                                    <div className="text-2xl font-bold">
                                        <Link className="cursor-pointer" href='/'  as={`/`}>
                                            {config.app.name}
                                        </Link>
                                    </div>

                                    <GlobalSearch></GlobalSearch>

                                    <div className="">
                                        <Link className="cursor-pointer hover:underline" href='/leaderboard' as={`/leaderboard`}>
                                            Leaderboard
                                        </Link>
                                    </div>
                                    <div className="">
                                        <Link className="cursor-pointer hover:underline" href='/lobby' as={`/lobby`}>
                                            Lobbies
                                        </Link>
                                    </div>
                                    <div className="">
                                        <Link className="cursor-pointer hover:underline" href='/ongoing' as={`/ongoing`}>
                                            Ongoing Matches
                                        </Link>
                                    </div>

                                    <div className="">
                                        <Link className="cursor-pointer hover:underline" href='/' as={`/`}>
                                            App
                                        </Link>
                                    </div>

                                    {
                                        config.game == 'aoe2' &&
                                        <div className="">
                                            <Link className="cursor-pointer hover:underline" href='/api-nightbot' as={`/api-nightbot`}>
                                                Api / Nightbot
                                            </Link>
                                        </div>
                                    }
                                </div>

                                <Component {...pageProps} />
                                <Analytics />
                                <SpeedInsights/>

                                <div className="flex-1"></div>

                                <div className="flex flex-row space-x-14 mt-4 mb-6 items-center">
                                    <div className="">
                                        <a href={`https://status.${config.host}`} target="_blank"
                                           className="flex flex-row space-x-2 items-center cursor-pointer hover:underline">
                                            <span>Status</span>
                                            <FontAwesomeIcon icon={faUpRightFromSquare} className="w-4 h-4"
                                                             color="grey"/>
                                        </a>
                                    </div>
                                </div>

                                <p className="pt-8 pb-4 text-xs md:text-sm text-center max-w-4xl mx-auto px-4 md:px-8">
                                    Age of Empires II©
                                    Microsoft Corporation. {config.host} was created under Microsoft's "
                                    <a className="text-gray-500"
                                       href="https://www.xbox.com/en-US/developers/rules"
                                       rel="noreferrer noopener">Game
                                        Content
                                        Usage Rules</a>
                                    " using assets from <a className="text-gray-500"
                                                           href={config.ms.url}
                                                           rel="noreferrer noopener">{config.ms.name}</a>
                                    , and it is
                                    not endorsed
                                    by or affiliated with Microsoft.
                                </p>
                            </div>

                        </main>
                    </NoSSRWrapper>
                </Hydrate>
                {/*<ReactQueryDevtools />*/}
            </QueryClientProvider>
        </>
    );
}

export default CustomApp;
