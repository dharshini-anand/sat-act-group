import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import style from "../styles/index.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useState, useEffect } from "react";
import { db } from "../lib/firebase"
import img from "../public/satact.png" 
import { onValue, ref } from "firebase/database";


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
      <main>
        <ul className={ style['product-grid'] }>
          { courses.map(product => ProductView({ product })) }
        </ul>
      </main>
    </>
  )
}

function ProductView ({ product }) {
  return (
    <li key={ product.id }>
      <Link href={ `/courses/${ product.id }` } prefetch={ false }>
        <a className={ style.product }>
          <div className={ style['product-image'] }>
            <Image alt="" height="427" width="640" src={ img } />
          </div>
          <div className={ style['product-description'] }>
            { product.name }
          </div>
        </a>
      </Link>
    </li>
  )
}

