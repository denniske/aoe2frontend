"use client";

import {useState} from 'react'
import {Combobox} from '@headlessui/react'
import {keepPreviousData, useQuery} from "@tanstack/react-query";
import {fetchProfiles} from "@/helper/api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faSearch} from "@fortawesome/free-solid-svg-icons";
import {bgColor, borderColor, textColor} from "./style.utils";
import {useRouter} from "next/navigation";
import {IProfilesResultProfile} from "@/helper/api.types";

export function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function GlobalSearch() {
    const [query, setQuery] = useState('')
    const [selectedPerson, setSelectedPerson] = useState(null)
    const router = useRouter()

    const profiles = useQuery({
        queryKey: ['profiles', query],
        queryFn: async (context: any) => {
            if (query?.length > 2) {
                return await fetchProfiles({
                    ...context,
                    search: query,
                });
            }
            return {profiles: []};
        },
        placeholderData: keepPreviousData,
    });

    const navigateToProfile = (profile) => {
        router.push(`/profile/${profile.profileId}`);
        (document.activeElement as any)?.blur();
    };

    const filteredPeople = profiles?.data?.profiles || [];

    return (
        <Combobox as="div" value={selectedPerson} onChange={navigateToProfile}>
            <div className="relative mt-1 w-60">
                <Combobox.Button
                    className="absolute pointer-events-none inset-y-0 left-1 flex items-center rounded-r-md px-2 focus:outline-none">
                    <FontAwesomeIcon className="w-3.5 text-gray-400" icon={faSearch}/>
                </Combobox.Button>

                <Combobox.Input
                    className={`w-full rounded-md ${textColor.default} ${bgColor.default} border ${borderColor.default} py-2 pl-8 pr-3 shadow-sm sm:text-sm`}
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(person: any) => person?.name}
                />

                {filteredPeople.length > 0 && (
                    <Combobox.Options
                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredPeople.map((person) => (
                            <Combobox.Option
                                key={person.profileId}
                                value={person}
                                className={({active}) =>
                                    classNames(
                                        'relative cursor-pointer select-none py-2 pl-3 pr-9 text-gray-900',
                                        active ? 'bg-gray-100' : ''
                                    )
                                }
                            >
                                {({active, selected}) => (
                                    <>
                                        <div className="flex flex-col">
                                            <div className="flex flex-row">
                                                <span className={classNames('truncate', selected && 'font-semibold')}>
                                                    {person.name}</span>
                                                {person.verified &&
                                                    <FontAwesomeIcon
                                                        className={classNames(
                                                            'w-3.5 ml-1 text-[#397AF9]',
                                                        )}
                                                        icon={faCheckCircle}/>
                                                }
                                            </div>
                                            <span
                                                className={classNames(
                                                    'truncate text-gray-500',
                                                )}
                                            >
                                            {person.games} games
                                          </span>
                                        </div>
                                    </>
                                )}
                            </Combobox.Option>
                        ))}
                    </Combobox.Options>
                )}
            </div>
        </Combobox>
    )
}
