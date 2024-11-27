'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/helper/supabase/server'
import { headers } from 'next/headers'
import {encodedRedirect} from "@/helper/util";

export async function login(formData: FormData) {
    const origin = (await headers()).get("origin");
    const supabase = await createClient()

    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
        return encodedRedirect(
            "error",
            "/login",
            "Email and password are required",
        );
    }

    const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
    })

    console.log('login', error, data);

    if (error) {
        return encodedRedirect("error", "/login", error.message);
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const origin = (await headers()).get("origin");
    const supabase = await createClient()

    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
        return encodedRedirect(
            "error",
            "/login",
            "Email and password are required",
        );
    }

    const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    })

    console.log('signup', error, data);

    if (error) {
        return encodedRedirect("error", "/login", error.message);
    }

    revalidatePath('/', 'layout')
    redirect('/')
}




// export async function loginWithOtp(formData: FormData) {
//     const supabase = await createClient()
//
//     // type-casting here for convenience
//     // in practice, you should validate your inputs
//     const form = {
//         email: formData.get('email') as string,
//     }
//
//     const { error, data } = await supabase.auth.signInWithOtp(form)
//
//     if (error) {
//
//         // return encodedRedirect("error", "/sign-in", error.message);
//
//         redirect('/error')
//     }
//
//     console.log(data);
//
//     revalidatePath('/', 'layout')
//     redirect('/')
// }
