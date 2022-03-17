import Link from 'next/link'
import LoginForm from '../components/loginform'
import { useRouter } from "next/router";
import { useAuth } from "../lib/auth";

export default function Login() {
    const router = useRouter();
    const auth = useAuth();
    if (auth.loading) {
        return <p>Loading...</p>;
    }
    if (auth.user) {
        router.push("/");
        return null;
    }
    if (!auth.user) {
        return (
            <div className="min-h-screen flex flex-col justify-center bg-gray-200">
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center mt-24">
                        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Log In</h2>
                        <p>
                            {"Don't have an account? "}
                            <Link href= "/sign-up">
                             <a href= "#" className="text-blue-500">
                                 Sign Up
                             </a>
                            </Link>
                        </p>
                    </div>
                    <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <LoginForm/>
                    </div>
                </div>
            </div> 
        )
    }
    
}