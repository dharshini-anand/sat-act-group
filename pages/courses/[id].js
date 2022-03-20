import Image from 'next/image'
import Head from 'next/head'
import style from '../../styles/product.module.css'
import img from "../../public/satact.png" 
import { useAuth } from "../../lib/auth";
import { useEffect, useState } from 'react'
import { db } from "../../lib/firebase"
import { onValue, ref, set } from 'firebase/database'

export default function ProductPage () {
    const auth = useAuth()
    const [ course, setCourse ] = useState([])
    const [ registered, setRegistered ] = useState([])
    const [ score, setScore ] = useState([])
    const handleSubmit = async (e, score) => {
      e.preventDefault()
      const userClassRef = ref(db, "users/" + auth.user.uid + "/classes/" + course.id)
      try {
        set(userClassRef, {
          name: course.name,
          goal_score: parseInt(score),
          id: course.id
        })
      } catch (err) {
        alert(err)
      }
    }
    useEffect(() => {
      const last = window.location.href.split('/').pop();
      const courseRef = ref(db, "classes/" + last)
      var courseCall = onValue(courseRef, (snapshot) => {
        console.log(snapshot.val())
        const data = snapshot.val()
        setCourse(data)
      })
      let userCourseCall
      if (auth.user) {
        if (!course.id) return;
        const userCourseRef = ref(db, "users/" + auth.user.uid + "/classes/" + course.id)
        userCourseCall = onValue(userCourseRef, (snapshot) => {
          if (snapshot.exists()) {
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
          <p>{course.description}</p>
          {registered == true
          ? (<p>Registered!</p>) 
          : (
            <div className="flex justify-center items-center flex-col">
              <h4>Register Here:</h4>
              <label htmlFor="score" className="block text-sm font-medium leading-5 text-gray-700">Goal Score</label>
              <input onKeyPress = {(e) => {
                if (!/[0-9]/.test(e.key)) {
                  e.preventDefault();
                }
              }}className= "appearance-none block w-1/6 object-center px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition duration-150 ease-in-out sm:text-sm sm:leading-5" placeholder= 'Goal Score' type='text' name='score' onChange={(e) => setScore(e.target.value)}/>
              <button className= "w-f1/6 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out"onClick={(e) => handleSubmit(e, score)}>Register</button>
            </div>
          )
          }
        </div>
      </div>
    </>
  }