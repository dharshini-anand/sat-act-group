import { useRouter } from "next/router";
import { useAuth } from "../lib/auth";
import { doc, getDoc } from "firebase/firestore"
import { db } from "../lib/firebase"

const userData = async (uid) => {
    const docRef = doc(db, "users", uid)
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        const user = docSnap.data();
        console.log("Document data:", docSnap.data());
        return user;
    } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
    }
}
export default function Dashboard () {
    const router = useRouter();
    const auth = useAuth();
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
        const user = userData(auth.user.uid);
        return (
            <h2>{user.first_name}&apos;s Dashboard</h2>
        )
    }
}