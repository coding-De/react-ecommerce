// A mock function to mimic making an async request for data
export function fetchAllProducts() {
  return new Promise(async(resolve) =>{
     const res = await fetch("http://localhost:8080/products")
     const data = await res.json()
     resolve({data})
  }
  );
}

export function fetchProductbyId(id) {
  return new Promise(async(resolve) =>{
     const res = await fetch("http://localhost:8080/products/"+id)
     const data = await res.json()
     resolve({data})
  }
  );
}

export function fetchProductsbyFilters(filter,sort,pagination) {
  let queryString = "";
  for(let key in filter){
    const categoryValues = filter[key];
    if(categoryValues.length){
      const lastCategoryValue = categoryValues[categoryValues.length-1]
      queryString += `${key}=${lastCategoryValue}&`
    }
  }
  for(let key in sort){
    queryString += `${key}=${sort[key]}&`
  }

  for(let key in pagination){
    queryString += `${key}=${pagination[key]}&`
  }

  return new Promise(async(resolve) =>{
     const res = await fetch("http://localhost:8080/products?"+queryString)
     const data = await res.json()
     const totalItems = res.headers.get('X-Total-Count')
     resolve({data:{products:data,totalItems:+totalItems}})
  }
  );
}

export function fetchBrand() {
  return new Promise(async(resolve) =>{
     const res = await fetch("http://localhost:8080/brand")
     const data = await res.json()
     resolve({data})
  }
  );
}

export function fetchCategories() {
  return new Promise(async(resolve) =>{
     const res = await fetch("http://localhost:8080/category")
     const data = await res.json()
     resolve({data})
  }
  );
}

export function createProduct(product) {
  return new Promise(async (resolve) => {
    const response = await fetch('http://localhost:8080/products/', {
      method: 'POST',
      body: JSON.stringify(product),
      headers: { 'content-type': 'application/json' },
    });
    const data = await response.json();
    resolve({ data });
  });
}

export function updateProduct(update) {
  return new Promise(async (resolve) => {
    const response = await fetch(
      'http://localhost:8080/products/' + update.id,
      {
        method: 'PATCH',
        body: JSON.stringify(update),
        headers: { 'content-type': 'application/json' },
      }
    );
    const data = await response.json();
    resolve({ data });
  });
}
