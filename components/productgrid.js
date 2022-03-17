import style from '../styles/index.module.css'
import Image from 'next/image'
import Link from 'next/link'
function ProductGrid( {products} ) {
    return(
        <ul className={ style['product-grid'] }>
          { products.map(product => ProductView({ product })) }
        </ul>
    )
}

function ProductView ({ product }) {
    return (
      <li key={ product.id }>
        <Link href={ `/product/${ product.id }` } prefetch={ false }>
          <a className={ style.product }>
            <div className={ style['product-image'] }>
              <Image alt="" height="427" width="640" src={ product.image } />
            </div>
            <div className={ style['product-description'] }>
              { product.name }
            </div>
            <div className={ style['product-price'] }>
              { product.capacity }
            </div>
          </a>
        </Link>
      </li>
    )
  }
 export default ProductGrid  