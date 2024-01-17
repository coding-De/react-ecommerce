import React from 'react'
import ProductDetail from '../features/product-list/ProductDetail'
import EcomNavBar from '../features/navBar/EcomNavBar'

export default function ProductDetailPage() {
  return (
    <div>
      <EcomNavBar>
        <ProductDetail />
      </EcomNavBar>
    </div>
  )
}
