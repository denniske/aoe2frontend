"use client";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {bgColor, borderColor, textColor} from "./style.utils";

export default function LocalSearch({className, placeholder, query, setQuery}) {
    return (
        <div>
            <div className={`relative mt-1 ${className}`}>
                <button
                    className="absolute pointer-events-none inset-y-0 left-1 flex items-center rounded-r-md px-2 focus:outline-none">
                    <FontAwesomeIcon className="w-3.5 text-gray-400" icon={faSearch}/>
                </button>

                <input
                    className={`w-full rounded-md ${textColor.default} ${bgColor.default} border ${borderColor.default} py-2 pl-8 pr-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm`}
                    onChange={(event) => setQuery(event.target.value)}
                    value={query}
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
}
