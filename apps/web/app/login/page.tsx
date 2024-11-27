import {login, signup} from './actions'

export default function LoginPage() {
    return (
        <div className="w-full flex flex-col items-center">
            <form className="w-[500px]">
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
                        value="dennis.keil10@gmail.com"
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
                        value="123abc"
                        required
                        className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm/6"
                    />
                </div>
                <br/>
                <button
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    formAction={login}>
                    Log in
                </button>
                <br/>
                <button
                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    formAction={signup}>
                    Sign Up
                </button>
            </form>
        </div>
    )
}
