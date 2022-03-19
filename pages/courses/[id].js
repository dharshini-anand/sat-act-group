import Image from 'next/image'
import Head from 'next/head'
import { getProductById, getProducts } from '../../lib/api'
import style from '../../styles/product.module.css'
import img from "../../public/satact.png" 
import { useRouter } from "next/router";
import { useAuth } from "../../lib/auth";
import { useEffect, useState } from 'react'
import {
  onSnapshot,
  collection,
  query,
  where,
  addDoc
} from "firebase/firestore";
import { db } from "../../lib/firebase"

export default function ProductPage () {
    const router = useRouter()
    const auth = useAuth()
    const { cid } = router.query
    const [ course, setCourse ] = useState([])
    const [ registered, setRegistered ] = useState([])
    const [ score, setScore ] = useState([])
    const handleSubmit = async (e, score) => {
      e.preventDefault()
      const userClasses = collection(db, `users/${auth.user.uid}/classes`)
      try {
        await addDoc(userClasses, {
          goal_score: score,
          id: course.id,
          name: course.name
        })
      } catch (err) {
        alert(err)
      }
    }
    //useEffect
    // find current course in courses
    // find courses in user
    // in courses find current course by course ids
    // if previous is undefined set course as unregistered
    // else set course as registered
    useEffect(() => {
      const last = window.location.href.split('/').pop();
      var courseCall = onSnapshot(query(collection(db, "courses")), where("id", "==", last), (snapshot) => {
        const courseDoc = snapshot.docs.map(doc => {
          return {id: doc.id,...doc.data()}
        })
        setCourse(courseDoc.find(course => course.id === last))
      })
      let userCourseCall
      if (auth.user) {
        if (!course.id) return;
        userCourseCall = onSnapshot(query(collection(db,`users/${auth.user.uid}/classes`), where("id", "==", course.id)), (snapshot) => {
          const userCourse = snapshot.docs.map(doc => {
            return {id: doc.id,...doc.data()}
          })
          const matchCourse = userCourse.filter(userCourse => userCourse.id === course.id)
          console.log(matchCourse)
          if (matchCourse.length == 1) {
            setRegistered(true)
          } else {
            setRegistered(false)
          }
        })
      }
      return () => {
        courseCall()
        userCourseCall?.()
      }
    })

    return <>
      <Head>
        <title>{ course.name }</title>
      </Head>
  
      <div className={ style.product }>
        <div className={ style.image }>
          <Image alt="" height="427" width="640" src={img} />
        </div>
  
        <div className={ style.header }>
          <h2>{ course.name }</h2>
          <p>{ course.teacher }</p>
          {registered == true
          ? (<p>Registered!</p>) 
          : (
            <div className="flex justify-center items-center flex-col">
              <h4>Register Here:</h4>
              <label htmlFor="score" className="block text-sm font-medium leading-5 text-gray-700">Goal Score</label>
              <input className= "appearance-none block w-1/6 object-center px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder= 'Goal Score' type='text' name='score' onChange={(e) => setScore(e.target.value)}/>
              <button className= "w-f1/6 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"onClick={(e) => handleSubmit(e, score)}>Register</button>
            </div>
          )
          }
        </div>
      </div>
    </>
  }