import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import {
    onSnapshot,
    collection,
    query,
    where
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
            userCall = onSnapshot(query(collection(db, "users"), where("uid", "==", auth.user.uid)), (snapshot) => {
                const userDocs = snapshot.docs.map(doc => {
                    return {id : doc.id,...doc.data()}
                })
                setUser(userDocs[0]);
            })
            classCall = onSnapshot(query(collection(db, `users/${auth.user.uid}/classes`), where("id", "!=", "test doc")), (snapshot) => {
                const classDocs = snapshot.docs.map(doc => {
                    return {id: doc.id,...doc.data()}
                })
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