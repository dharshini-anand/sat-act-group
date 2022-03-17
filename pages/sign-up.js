import Link from 'next/link'
import SignUpForm from '../components/signupform'

export default function SignUp () {
    return (
        <div className="min-h-screen flex flex-col justify-center bg-gray-200">
           <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
               <div className="text-center mt-24">
                   <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign Up</h2>
                   <p>
                       {"Already have an account? "}
                       <Link href= "/sign-in">
                        <a href= "#" className="text-blue-500">
                            Sign In
                        </a>
                       </Link>
                   </p>
               </div>
               <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                   <SignUpForm/>
               </div>
           </div>
       </div> 
    )
}
