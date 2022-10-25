/*
  This example requires some changes to your config:

  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import {useState} from 'react'
import {CheckIcon, ChevronUpDownIcon} from '@heroicons/react/20/solid'
import {Combobox} from '@headlessui/react'
import {useQuery} from "@tanstack/react-query";
import {fetchProfile, fetchProfiles} from "../helper/api";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle, faSearch} from "@fortawesome/free-solid-svg-icons";
import {useRouter} from "next/router";

const people = [
    {id: 1, name: 'Leslie Alexander'},
    // More users...
]

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function GlobalSearch() {
    const [query, setQuery] = useState('')
    const [selectedPerson, setSelectedPerson] = useState(null)
    const router = useRouter()

    const profiles = useQuery(
        ['profiles', query],
        (context: any) => {
            if (query?.length > 2) {
                return fetchProfiles({
                    ...context,
                    search: query,
                });
            }
            return [];
        }, {
            // enabled: query?.length > 2,
            keepPreviousData: true,
        });

    const navigateToProfile = (profile) => {
        console.log('navigateToProfile', profile);
        router.push(`/profile/${profile.profileId}`);
    };

    console.log(profiles?.data?.profiles);

    // const filteredPeople =
    //     query === ''
    //         ? people
    //         : people.filter((person) => {
    //             return person.name.toLowerCase().includes(query.toLowerCase())
    //         })

    const filteredPeople = profiles?.data?.profiles || [];

    return (
        <Combobox as="div" value={selectedPerson} onChange={navigateToProfile}>
            <div className="relative mt-1 w-80">
                <Combobox.Button
                    className="absolute pointer-events-none inset-y-0 left-1 flex items-center rounded-r-md px-2 focus:outline-none">
                    <FontAwesomeIcon className="w-3.5 text-gray-400" icon={faSearch}/>
                </Combobox.Button>

                <Combobox.Input
                    className="w-full rounded-md border border-gray-300 bg-white py-2 pl-8 pr-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
                    onChange={(event) => setQuery(event.target.value)}
                    displayValue={(person: any) => person?.name}
                />

                {filteredPeople.length > 0 && (
                    <Combobox.Options
                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                        {filteredPeople.map((person) => (
                            <Combobox.Option
                                key={person.id}
                                value={person}
                                className={({active}) =>
                                    classNames(
                                        'relative cursor-pointer select-none py-2 pl-3 pr-9',
                                        active ? 'bg-indigo-600 text-white' : 'text-gray-900'
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
                                                            'w-3.5 ml-1 ',
                                                            active ? 'text-white' : 'text-[#397AF9] '
                                                        )}
                                                        icon={faCheckCircle}/>
                                                }
                                            </div>
                                            <span
                                                className={classNames(
                                                    'truncate text-gray-500',
                                                    active ? 'text-indigo-200' : 'text-gray-500'
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