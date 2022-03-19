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
import { onValue, ref } from "firebase/database";

export default function Dashboard () {
    const router = useRouter();
    const auth = useAuth();
    const [user, setUser] = useState([])
    const [courses, setCourses] = useState([])
    useEffect(() => {
        let userCall;
        let classCall;
        if (auth.user) {
            const userRef = ref(db, 'users/' + auth.user.uid);
            userCall = onValue(userRef, (snapshot) => {
                const data = snapshot.val()
                setUser(data);
            })
            const classRef = ref(db, 'users/' + auth.user.uid + '/classes');
            classCall = onValue(classRef, (snapshot) => {
                let classes = [];
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        classes.push({key: childSnapshot.key,... childSnapshot.val()})
                    })
                }
                setCourses(classes)
            })
        }
        return () => {
            userCall?.()
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
                {courses.map((course) => (
                    <CourseDash key = {course.key} course = {course}/>
                ))}
            </div>
        )
    }
}