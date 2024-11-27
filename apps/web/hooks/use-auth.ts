"use client";

import {useEffect, useState} from "react";
import {createClient} from "@/helper/supabase/client";
import {AuthUser} from "@supabase/supabase-js";

export const supabaseClient = createClient()

export default function useAuth() {
    const [session, setSession] = useState<any | undefined>();
    const [user, setUser] = useState<AuthUser | undefined>();

    useEffect(() => {
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user);
        })

        const {
            data: { subscription },
        } = supabaseClient.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user);
        })

        return () => subscription.unsubscribe()
    }, [])

    return user;
}






