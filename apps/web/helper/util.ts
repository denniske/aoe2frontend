import {format, formatDistanceToNowStrict, fromUnixTime, parseISO} from "date-fns";
import enUS from 'date-fns/locale/en-US';

import {redirect} from "next/navigation";

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
    type: "error" | "success",
    path: string,
    message: string,
) {
    return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}

export function sleep(ms: number) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

interface IParams {
    [key: string]: any;
}

export function removeReactQueryParams(params: any) {
    const {queryKey, pageParam, meta, signal, ...rest} = params;
    return rest;
}

export function makeQueryString(params: IParams) {
    return new URLSearchParams(params).toString();
    // return Object.keys(params)
    //     .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
    //     .join('&');
}

const apiKey = process.env.NEXT_PUBLIC_API_KEY;

const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

export function dateReviver(key, value) {
    // console.log(key, value);
    if (typeof value === "string" && dateFormat.test(value)) {
        // console.log("DATE", value);
        // return new Date(value);
        return parseISO(value);
    }
    return value;
}

export async function fetchJson(title: string, input: RequestInfo, init?: RequestInit) {
    if (init) {
        console.log(input, init);
    } else {
        console.log(input);
    }
    let response: Response | null = null;
    try {
        response = await fetch(input, {
            ...init,
            // headers: {
            //     apikey: apiKey,
            // },
            // timeout: 60 * 1000,
        });
        const text = await response.text();
        return JSON.parse(text, dateReviver);
    } catch (e) {
        console.log(input, 'failed', response?.status);
    }
}

export function formatAgo(date: Date) {
    // return formatDistanceToNowStrict(date, {addSuffix: true});
    return formatDistanceToNowStrict(date, {locale: enUS, addSuffix: true});
}

export function parseUnixTimestamp(timestamp: number) {
    return fromUnixTime(timestamp);
}

export function formatYear(date: Date) {
    return format(date, 'yyyy', {locale: enUS});
}

export function formatMonth(date: Date) {
    return format(date, 'MMM', {locale: enUS});
}

export function formatDateShort(date: Date) {
    return format(date, 'MMM d', {locale: enUS});
}

export function formatDayAndTime(date: Date) {
    return format(date, 'MMM d HH:mm', {locale: enUS});
}

export function formatTime(date: Date) {
    return format(date, 'HH:mm', {locale: enUS});
}

export function formatDate(date: Date) {
    return format(date, 'dd MM yyyy', {locale: enUS});
}

