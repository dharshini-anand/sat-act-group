import React, { useState } from "react";
import { useAuth } from "../lib/auth";
import { useRouter } from "next/router";
import SignUpForm from "./signupform";

export default function LoginForm () {
    const router = useRouter();
    const auth = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const signIn = (event, email, password) => {
        auth
        .signIn(email, password)
        .then(() => {
            router.push("/")
        })
        .catch((error) => {
            console.log(error);
        })
    }
    return (
        <div>
            <div className= "rounded-md shadow-sm">
                <label htmlFor="email" className="block text-sm font-medium leading-5 text-gray-700">Email</label>
                <input id="email" type="email" name="email" 
                className= "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" onChange={(e) => setEmail(e.target.value)} 
                />
            </div>
            <div className= "rounded-md shadow-sm">
                <label htmlFor="password" className="block text-sm font-medium leading-5 text-gray-700">Password</label>
                <input id="password" type="password" name="password" 
                className= "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="mt-6">
                <span className="block w-full rounded-md shadow-sm">
                    <button className= "w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out" onClick={(e)=> signIn(e, email, password)}>
                        Sign In
                    </button>
                </span>
            </div>
        </div>
    )
}

