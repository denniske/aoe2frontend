import {getConfig} from "@/helper/config";

const config = getConfig();

export default function ApiNightbot() {
    return (
        <div className="flex flex-col">

            <div className="text-lg my-6">
                Api
            </div>

            <p>
                There is no public api yet. During development of this site the current internal api will be polished so that it can be opened up later.
            </p>


            <div className="text-lg my-6">
                Nightbot
            </div>

            <div className="text-lg font-bold my-3">
                Rank
            </div>
            <div className="text-base">
                Request rank details about a player
            </div>

            <div className="text-base font-bold my-3">
                Request Parameters
            </div>
            <div className="ml-2 space-y-2">
                <div className="">
                    <div className="text-base">
                        leaderboard_id (Optional, defaults to 3)
                    </div>
                    <div className="text-sm">
                        Leaderboard ID (Unranked=0, 1v1 Deathmatch=1, Team Deathmatch=2, 1v1 Random Map=3, Team Random Map=4, 1v1 Empire Wars=13, Team Empire Wars=14)
                    </div>
                </div>
                <div className="">
                    <div className="text-base">
                        flag (Optional, defaults to true)
                    </div>
                    <div className="text-sm">
                        Show player flag
                    </div>
                </div>
                <div className="">
                    <div className="text-base">
                        search (search, steam_id or profile_id required)
                    </div>
                    <div className="text-sm">
                        Name Search, returns the highest rated player
                    </div>
                </div>
                <div className="">
                    <div className="text-base">
                        steam_id (search, steam_id or profile_id required)
                    </div>
                    <div className="text-sm">
                        steamID64 (ex: 76561199003184910)
                    </div>
                </div>
                <div className="">
                    <div className="text-base">
                        profile_id (search, steam_id or profile_id required)
                    </div>
                    <div className="text-sm">
                        Profile ID (ex: 459658)
                    </div>
                </div>
            </div>


            <div className="text-lg my-3">
                Example Command
            </div>
            <div className="ml-2 space-y-2">
                <div className="">
                    <div className="text-sm">
                        !addcom !rank $(urlfetch https://data.{config.host}/api/nightbot/rank?leaderboard_id=3&search=$(querystring)&steam_id=76561199003184910&flag=false)
                    </div>
                </div>
            </div>

            <div className="text-lg my-3">
                Example Responses
            </div>
            <div className="ml-2 space-y-2">
                <div className="">
                    <div className="text-sm">
                        twitchuser: !rank
                    </div>
                    <div className="text-sm">
                        Nightbot: Hoang (1799) Rank #44, has played 1181 games with a 59% winrate, -1 streak, and 20 drops
                    </div>
                </div>
                <div className="">
                    <div className="text-sm">
                        twitchuser: !rank Hera
                    </div>
                    <div className="text-sm">
                        Nightbot: Hera (2118) Rank #1, has played 659 games with a 71% winrate, +6 streak, and 3 drops
                    </div>
                </div>
            </div>


            <div className="text-lg font-bold my-3">
                Match
            </div>
            <div className="text-base">
                Request details about the current or last match
            </div>

            <div className="text-base font-bold my-3">
                Request Parameters
            </div>
            <div className="ml-2 space-y-2">
                <div className="">
                    <div className="text-base">
                        leaderboard_id (Optional)
                    </div>
                    <div className="text-sm">
                        Leaderboard ID can be used to restrict player result to a leaderboard (Unranked=0, 1v1 Deathmatch=1, Team Deathmatch=2, 1v1 Random Map=3, Team Random Map=4, 1v1 Empire Wars=13, Team Empire Wars=14)
                    </div>
                </div>
                <div className="">
                    <div className="text-base">
                        color (Optional, defaults to true)
                    </div>
                    <div className="text-sm">
                        Show player colors
                    </div>
                </div>
                <div className="">
                    <div className="text-base">
                        search (search, steam_id or profile_id required)
                    </div>
                    <div className="text-sm">
                        Name Search, returns the highest rated player
                    </div>
                </div>
                <div className="">
                    <div className="text-base">
                        steam_id (search, steam_id or profile_id required)
                    </div>
                    <div className="text-sm">
                        steamID64 (ex: 76561199003184910)
                    </div>
                </div>
                <div className="">
                    <div className="text-base">
                        profile_id (search, steam_id or profile_id required)
                    </div>
                    <div className="text-sm">
                        Profile ID (ex: 459658)
                    </div>
                </div>
            </div>


            <div className="text-lg my-3">
                Example Command
            </div>
            <div className="ml-2 space-y-2">
                <div className="">
                    <div className="text-sm">
                        !addcom !match $(urlfetch https://data.{config.host}/api/nightbot/match?search=$(querystring)&steam_id=76561199003184910&color=false&flag=false)
                    </div>
                </div>
            </div>

            <div className="text-lg my-3">
                Example Responses
            </div>
            <div className="ml-2 space-y-2">
                <div className="">
                    <div className="text-sm">
                        twitchuser: !match
                    </div>
                    <div className="text-sm">
                        Nightbot: Hoang (1815) as Celts -VS- DracKeN (1820) as Celts playing on Black Forest
                    </div>
                </div>
                <div className="">
                    <div className="text-sm">
                        twitchuser: !match Hera
                    </div>
                    <div className="text-sm">
                        Nightbot: Hera (2112) as Mayans -VS- ACCM (1960) as Aztecs playing on Gold Rush
                    </div>
                </div>
            </div>

        </div>
    );
}
