import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import {
    onSnapshot,
    collection
} from "firebase/firestore";
import { db } from "../lib/firebase"
import CourseDash from "../components/coursedash";

export default function Dashboard () {
    const router = useRouter();
    const auth = useAuth();
    const [user, setUser] = useState([])
    const [classes, setClasses] = useState([])
    useEffect(() => {
        let userCall;
        let classCall;
        if (auth.user) {
            userCall = onSnapshot(collection(db, "users"), (snapshot) => {
                const userDocs = snapshot.docs.map(doc => {
                    return {id : doc.id,...doc.data()}
                })
                let currentUser = userDocs.find((user) => user.id == auth.user.uid)
                console.log(currentUser)
                setUser(currentUser);
            })
            classCall = onSnapshot(collection(db, `users/${auth.user.uid}/classes`), (snapshot) => {
                const classDocs = snapshot.docs.map(doc => {
                    return {id: doc.id,...doc.data()}
                })
                console.log(classDocs)
                setClasses(classDocs)
            })
        }
        return () => {
            userCall?.()
            classCall?.()
        }
    }, [auth.user]);
    if (auth.loading) {
        return (
            <p>Loading...</p>
        )
    }
    if (!auth.user) {
        router.push("/sign-in")
        return null;
    }
    if (auth.user) {
        return (
            <div>
                <h2>{user && user.first_name}&apos;s Dashboard</h2>
                {classes.map((course) => (
                    <CourseDash key = {course.id} course = {course}/>
                ))}
            </div>
        )
    }
}