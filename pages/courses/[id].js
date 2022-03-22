import Image from 'next/image'
import Head from 'next/head'
import style from '../../styles/product.module.css'
import img from "../../public/satact.png" 
import { useRouter } from "next/router";
import { useAuth } from "../../lib/auth";
import { useEffect, useState } from 'react'
import { db } from "../../lib/firebase"
import { onValue, ref, set } from 'firebase/database'
import { Alert, Card, ProgressBar, Button, Modal, Form } from 'react-bootstrap';

export default function ProductPage () {
    const auth = useAuth()
    const router = useRouter()
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
        router.push("/dashboard")
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
          // using auth state below to render conditionally
          : auth.user && (
            <div className="flex justify-center items-center flex-col">
              <h4>Register Here:</h4>
              <Form>
                <Form.Group className="mb-3" controlId="input1">
                  <Form.Label>Goal Score</Form.Label>
                  <Form.Control type="text" onChange={(e) => setScore(e.target.value)} onKeyPress = {(e) => {
                  if (!/[0-9]/.test(e.key)) {
                    e.preventDefault();
                  }}}/>
                </Form.Group>
                <Button variant="primary" type="submit" onClick={(e) => handleSubmit(e, score)}> Register </Button>
              </Form>
            </div>
          )
          }
        </div>
      </div>
    </>
  }