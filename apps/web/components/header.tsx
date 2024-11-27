"use client";

import GlobalSearch from "@/components/global-search";
import useAuth from "@/hooks/use-auth";
import {getConfig} from "@/helper/config";
import React from "react";
import Link from "next/link";

const config = getConfig();

export function Header() {
    const user = useAuth();

    return <div className="flex flex-row space-x-14 mt-4 mb-6 items-center">
        <div className="text-2xl font-bold">
            <Link className="cursor-pointer" href="/" as={`/`}>
                {config.app.name}
            </Link>
        </div>

        <GlobalSearch></GlobalSearch>

        <div className="">
            <Link className="cursor-pointer hover:underline" href="/apps/web/pages/leaderboard2"
                  as={`/leaderboard`}>
                Leaderboard
            </Link>
        </div>
        <div className="">
            <Link className="cursor-pointer hover:underline" href="/lobby" as={`/lobby`}>
                Lobbies
            </Link>
        </div>
        <div className="">
            <Link className="cursor-pointer hover:underline" href="/ongoing" as={`/ongoing`}>
                Ongoing Matches
            </Link>
        </div>

        <div className="">
            <Link className="cursor-pointer hover:underline" href="/" as={`/`}>
                App
            </Link>
        </div>

        {
            user &&
            <div className="">
                <Link className="cursor-pointer hover:underline" href="/" as={`/`}>
                    <button className="bg-gray-100 p-2 rounded-md">
                        Account {user?.email}
                    </button>
                </Link>
            </div>
        }

        {
            !user &&
            <div className="">
                <Link className="cursor-pointer hover:underline" href="/login" as={`/login`}>
                    <button className="bg-gray-100 p-2 rounded-md">
                        Login
                    </button>
                </Link>
            </div>
        }

    </div>;
}
