import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from "react";
import { db } from "../lib/firebase"
import img from "../public/satact.png" 
import { onValue, ref } from "firebase/database";
import { Card } from "react-bootstrap"


export default function Home({ products }) {
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    var courseRef = ref(db, "classes/");
    const courseCall = onValue(courseRef, (snapshot) => {
      let classes = [];
      if (snapshot.exists()) {
          snapshot.forEach((childSnapshot) => {
              classes.push({key: childSnapshot.key,... childSnapshot.val()})
          })
      }
      setCourses(classes)
    })
    return () => {
      courseCall()
    }
  })
  return (
    <>
      <Head>
        <title>SAT/ACT Group Courses</title>
      </Head>
      <h1>Available Courses</h1>
      <div className = "container mx-auto grid grid-cols-4 ">
          { courses.map(product => ProductView({ product })) }
      </div>
    </>
  )
}

function ProductView ({ product }) {
  return (
    <div key={ product.id } className="p-2">
      <Link href={ `/courses/${ product.id }` } prefetch={ false }>
          <Card>
            <Image src={img}/>
            <Card.Body>
              <h3 className='text-left'>{product.name}</h3>
              <h5 className='text-left'>{product.teacher}</h5>
              <p className='text-left'>{product.description}</p>
            </Card.Body>
          </Card>
      </Link>
    </div>
  )
}

