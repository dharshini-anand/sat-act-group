import { arrayUnion, doc, updateDoc } from "firebase/firestore";
import { db } from '../lib/firebase'
import { useAuth } from "../lib/auth";
import { useState, useEffect } from "react";

export default function CourseDash ( { course } ) {
    const auth = useAuth();
    const [score, setScore] = useState([])
    const [notes, setNotes] = useState([])
    const handleSubmit = async (e, score, notes) => {
        e.preventDefault();
        const classDocRef = doc(db, `users/${auth.user?.uid}/classes`, course.id)
        try {
            await updateDoc(classDocRef, {
                scores: arrayUnion({
                    score: score,
                    notes: notes
                })
            })
        } catch (err) {
            alert (err)
        }
    }
    return (
        <div key = {course.id}>
            <h2>{course.name}</h2>
            <h3>Your goal score: {course.goal_score}</h3>
            <div>
                <h3>Your previous scores:</h3>
                {course.scores && course.scores.map((score) => (
                <p key={score}>{score}</p>
                ))}
            </div>
            <div className="flex justify-center items-center flex-col">
                <h4>Add a score:</h4>
                <input className= "appearance-none block w-1/6 object-center px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" type='text' name='score' placeholder='New Score' onChange={(e) => setScore(e.target.value)}/>
                <input className= "appearance-none block w-1/6 object-center px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" type='text' name='notes' placeholder="notes" onChange={(e) => setNotes(e.target.value)}/>
                <button className= "w-f1/6 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"onClick={(e) => handleSubmit(e, score, notes)}>Submit</button>
            </div>
            
        </div>
    )
}