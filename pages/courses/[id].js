import Image from 'next/image'
import Head from 'next/head'
import { getProductById, getProducts } from '../../lib/api'
import style from '../../styles/product.module.css'

export async function getStaticPaths () {
    const products = await getProducts()
    const paths = products.map(product => ({
        params: {
            id: product.id
        }
    }))
    return {
        paths,
        fallback: false
    }
}

export async function getStaticProps({params}) {
    return {
        props: {
            product: await getProductById(params.id)
        }
    }
}

export default function ProductPage ({ product }) {
    return <>
      <Head>
        <title>{ product.name }</title>
      </Head>
  
      <div className={ style.product }>
        <div className={ style.image }>
          <Image alt="" height="427" width="640" src={ product.image } />
        </div>
  
        <div className={ style.header }>
          <h2>{ product.name }</h2>
          <p className={ style.price }>{ product.capacity }</p>
        </div>
      </div>
    </>
  }