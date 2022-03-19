import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import style from "../styles/index.module.css";
import Layout from '../components/layout'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useAuth } from "../lib/auth";
import {
    onSnapshot,
    collection
} from "firebase/firestore";
import { db } from "../lib/firebase"
import img from "../public/satact.png" 


export default function Home({ products }) {
  const auth = useAuth();
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [userCourses, setUserCourses] = useState([]);
  useEffect(() => {
    var courseCall = onSnapshot(collection(db, "courses"), (snapshot) => {
      const courseDocs = snapshot.docs.map(doc => {
        return {id: doc.id,...doc.data()}
      })
      setCourses(courseDocs);
    })
    let userCourseCall;
    if (auth.user) {
      userCourseCall = onSnapshot(collection(db, `users/${auth.user.uid}/      classes`), (snapshot) => {
        const classDocs = snapshot.docs.map(doc => {
            return {id: doc.id,...doc.data()}
        })
      })
    }
    return () => {
      courseCall()
      userCourseCall?.()
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

