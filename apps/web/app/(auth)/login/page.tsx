"use client";

// import {createClient} from "@/helper/supabase/client";
import { useRouter } from "next/navigation";
import {useState} from "react";
import {supabaseClient} from "@/hooks/use-auth";

export default function LoginPage() {
    const router = useRouter();
    const [method, setMethod] = useState("login");
    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState("dennis.keil10@gmail.com");
    const [password, setPassword] = useState("123abc");

    const login = async () => {
        const { error, data } = await supabaseClient.auth.signInWithPassword({
            email,
            password,
        });

        console.log('login', error?.message, data);

        if (data?.user) {
            router.push('/account');
        }
        if (error) {
            setErrorMessage(error.message);
        }
    };

    const signup = async () => {
        const { error, data } = await supabaseClient.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${origin}`
            }
        });

        console.log('signup', error?.message, data);

        if (error) {
            setErrorMessage(error.message);
        }
    };

    const loginWithDiscord = async () => {
        const { error, data } = await supabaseClient.auth.signInWithOAuth({
            provider: 'discord',
            options: {
                redirectTo: `${origin}/auth/callback`
            }
        });

        console.log('signup', error?.message, data);

        if (error) {
            setErrorMessage(error.message);
        }
    };

    const changeMethod = async (method: string) => {
        setMethod(method);
        setErrorMessage("");
    };

    return (
        <div className="w-full flex flex-col items-center">
            <form className="w-[500px]">
                <button
                    className="flex flex-row justify-center gap-2 items-center w-full p-2 rounded-md bg-gray-100 border-blue-500 border-1"
                    onClick={loginWithDiscord}
                >
                    <svg className="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="21px"
                         height="21px">
                        <path fill="#FFC107"
                              d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
                        <path fill="#FF3D00"
                              d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
                        <path fill="#4CAF50"
                              d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
                        <path fill="#1976D2"
                              d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    Sign in with Google
                </button>
                <br/>
                <br/>
                <label
                    htmlFor="email"
                    className="block text-sm/6 font-medium text-gray-900"
                >
                    Email:
                </label>
                <div className="mt-2">
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    />
                </div>
                <br/>
                <label
                    htmlFor="password"
                    className="block text-sm/6 font-medium text-gray-900"
                >
                    Password:
                </label>
                <div className="mt-2">
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    />
                </div>
                <br/>
                <div className="text-red-500">
                    {errorMessage}
                </div>
                <br/>
                <button
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    formAction={method == 'login' ? login : signup}>
                    {method == 'login' ? 'Log in' : 'Sign up'}
                </button>
                <br/>
                <div className="flex flex-col items-center">
                    {
                        method === 'signup' &&
                        <div
                            className="underline cursor-pointer"
                            onClick={() => changeMethod('login')}>
                            Already have an account? Sign in
                        </div>
                    }
                    {
                        method === 'login' &&
                        <>
                            <div
                                className="underline cursor-pointer"
                                onClick={() => changeMethod('signup')}>
                                Forgot your password?
                            </div>
                            <br/>
                            <div
                                className="underline cursor-pointer"
                                onClick={() => changeMethod('signup')}>
                                Don't have an account? Sign up
                            </div>
                        </>
                    }
                </div>
            </form>
        </div>
    )
}
