import React from 'react';
import ProductList from '../features/product-list/ProductList';
import EcomNavBar from '../features/navBar/EcomNavBar';

export default function Home() {
  return (
    <div>
      <EcomNavBar>
        <ProductList></ProductList>
      </EcomNavBar>
    </div>
  )
}
