import {ReactQueryClientProvider} from "@/components/react-query-client-provider";
import {polyfillCountryFlagEmojis} from 'country-flag-emoji-polyfill';
import './styles.css';
import {getConfig} from "@/helper/config";
import Link from "next/link";
import GlobalSearch from "@/components/global-search";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUpRightFromSquare} from "@fortawesome/free-solid-svg-icons";
import {createClient} from "@/helper/supabase/server";
import {Header} from "@/components/header";

polyfillCountryFlagEmojis();

const config = getConfig();

export const metadata = {
    title: config.app.name,
    description: 'Track your AoE II Definitive Edition games. Analyze your performance and compare with your friends.',
}

export default async function RootLayout({children}: {
    children: React.ReactNode
}) {

    const supabase = await createClient()

    const { data, error } = await supabase.auth.getUser()

    // if (error || !data?.user) {
    //     redirect('/login')
    // }

    console.log('user', data?.user);

    return (
        <ReactQueryClientProvider>
            <html lang="en">
            <head>
                <link rel="icon" type="image/png" href={`/web/${config.game}/favicon-16x16.png?v=200706014637`}
                      sizes="16x16"/>
                <link rel="icon" type="image/png" href={`/web/${config.game}/favicon-32x32.png?v=200706014637`}
                      sizes="32x32"/>
                <link rel="icon" type="image/png" href={`/web/${config.game}/favicon-96x96.png?v=200706014637`}
                      sizes="96x96"/>
                <link rel="dns-prefetch" href="//data.aoe2companion.com"/>
            </head>
            <body>
            <main className="flex flex-col items-center">

                <div className="flex flex-col px-6 py-4 min-h-[100vh] w-full max-w-[1200px] m-x-auto">

                    <Header />

                    {children}

                    <div className="flex-1"></div>

                    <div className="flex flex-row space-x-14 mt-4 mb-6 items-center">

                        {
                            config.game == 'aoe2' &&
                            <div className="">
                                <Link className="cursor-pointer hover:underline" href='/api-nightbot'
                                      as={`/api-nightbot`}>
                                    Api / Nightbot
                                </Link>
                            </div>
                        }

                        <a href={`https://status.${config.host}`} target="_blank"
                           className="flex flex-row space-x-2 items-center cursor-pointer hover:underline">
                            <span>Status</span>
                            <FontAwesomeIcon icon={faUpRightFromSquare} className="w-4 h-4"
                                             color="grey"/>
                        </a>
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

            </body>
            </html>
        </ReactQueryClientProvider>
    )
}
