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
  where
} from "firebase/firestore";
import { db } from "../../lib/firebase"

export default function ProductPage () {
    const router = useRouter()
    const auth = useAuth()
    const { cid } = router.query
    const [ course, setCourse ] = useState([])
    const [ registered, setRegistered ] = useState([])
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
        console.log(courseDoc[0])
        setCourse(courseDoc[0])
      })
      let userCourseCall
      if (auth.user) {
        if (!course.id) return;
        userCourseCall = onSnapshot(query(collection(db,`users/${auth.user.uid}/classes`), where("id", "==", course.id)), (snapshot) => {
          const userCourse = snapshot.docs.map(doc => {
            return {id: doc.id,...doc.data()}
          })
          if (userCourse.length == 1) {
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
          <p>{ course.name }</p>
          {(auth.user && registered) && (<p>Registered!</p>)}
        </div>
      </div>
    </>
  }