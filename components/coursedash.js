import { onValue, ref, set, push, remove, serverTimestamp } from 'firebase/database'
import { db } from '../lib/firebase'
import { useAuth } from "../lib/auth";
import { useState, useEffect } from "react";
import { Alert, Card, ProgressBar, Button, Modal } from 'react-bootstrap';
import { LineChart } from '@rsuite/charts'
import { Score, BinaryScoreTree } from '../lib/bst'

function convertToDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}
function average(scores) {
    const avg = 0;
    for (let i = 0; i < scores.length; i++) {
        avg += parseInt(scores[i].score)
    }
    avg /= scores.length
    if (scores.length == 0) {
        return "---"
    } else {
        return Math.round(avg / 10) * 10
    } 
}

export default function CourseDash ( { course } ) {
    const auth = useAuth();
    const [score, setScore] = useState([])
    const [notes, setNotes] = useState([])
    const [scoreCollection, setScoreCollection] = useState([])
    const [graphData, setGraphData] = useState([]);
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const handleSubmit = async (e, score, notes) => {
        e.preventDefault();
        const userCourseScoreRef = ref(db, "users/" + auth.user.uid + "/classes/" + course.id + "/scores")
        const newScoreRef = push(userCourseScoreRef)
        try {
            await set(newScoreRef, {
                score: parseInt(score),
                notes: notes,
                timestamp: serverTimestamp()
            })
        } catch (err) {
            alert (err)
        }
        handleClose()
    }
    const handleDelete = async (e) => {
        e.preventDefault();
        const userCourseRef = ref(db, "users/" + auth.user.uid + "/classes/" + course.id)
        try {
            await remove(userCourseRef)
        } catch (err) {
            alert(err)
        }
    }
    useEffect(() => {
        let scoreCall
        if (auth.user) {
            const scoresRef = ref(db, "users/" + auth.user.uid + "/classes/" + course.id + "/scores")
            scoreCall = onValue(scoresRef, (snapshot) => {
                let scores = [];
                let scoreTree = new BinaryScoreTree();
                if (snapshot.exists()) {
                    snapshot.forEach((childSnapshot) => {
                        const key = childSnapshot.key
                        const val = childSnapshot.val()
                        scoreTree.insert(val.timestamp, val.score, val.notes)
                        scores.push({key: key,... val})
                    })
                }
                scoreTree.inOrder(scoreTree.getRoot())
                scores = scoreTree.inOrderList
                setScoreCollection(scores)
                let data = [];
                for (let i = 0; i < scores.length; i++) {
                    data.push([i+1, scores[i].score])
                }
                setGraphData(data)
            }, {onlyOnce: true})
        }
        return () => {
            scoreCall?.()
        }
    })
    return (
        <div key = {course.id} className="container mx-auto py-2">
            <Alert>
                <Alert.Heading>
                    <h2 className='text-left'>{course.name}</h2>
                </Alert.Heading>
            </Alert>
            <div className='grid grid-cols-2'>
                <h3 className='text-left'>Average Score: {average(scoreCollection)}</h3>
                <h3 className='text-right'>Your goal score: {course.goal_score}</h3>
                
            </div>
            <div>
                <ProgressBar now= {average(scoreCollection) != "---" && average(scoreCollection) * 100 / course.goal_score} striped/>
            </div>
            <div>
                <h3 className='text-left'>Your previous scores:</h3>
                <LineChart name={course.name} data = {graphData}/>
                <div className="grid grid-cols-3 items-center">
                {scoreCollection && scoreCollection.map((score) => (
                    <div key = {score.key} className="px-2 py-2"> 
                        <Card variant="success">
                            <Card.Body>
                                <Card.Title>
                                    <h2 className='text-center'>{score.score}</h2>
                                </Card.Title>
                                <p>{score.notes}</p>
                            </Card.Body>
                            <Card.Footer>
                                <small className='text-left text-muted'>{convertToDate(score.timestamp)}</small>
                            </Card.Footer>
                        </Card>
                    </div>
                ))}
                    <div className="px-2 py-2">
                        <Button onClick={handleShow}>
                            <div className="container mx-auto my-auto"><h1>Add Score</h1></div>
                        </Button>
                    </div>
                </div>
            </div>
            <Modal show = {show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a score:</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="flex justify-center items-center flex-col py-2">
                    <input onKeyPress = {(e) => {
                    if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                    }}} className= "appearance-none block object-center px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" type='text' name='score' placeholder='New Score' onChange={(e) => setScore(e.target.value)}/>
                    <input className= "appearance-none block object-center px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" type='text' name='notes' placeholder="notes" onChange={(e) => setNotes(e.target.value)}/>
                    <button className= " flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"onClick={(e) => handleSubmit(e, score, notes)}>Submit</button>
                    </div>
                </Modal.Body>
            </Modal>
            <div className="flex justify-center py-3">
                <button className= "w-f1/6 flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"onClick={(e) => handleDelete(e)}>Unenroll from {course.name}</button>
            </div>
            
        </div>
    )
}