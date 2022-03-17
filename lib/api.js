const data = [
  {
    id: "sat-math",
    image: "/images/sabrinna-ringquist-2z7MxnXQs3k-unsplash.jpg",
    name: "SAT Math",
    category: "SAT",
    teacher: "Example Teacher",
    capacity: 30,
  }, 
  {
    id: "act-reading",
    image: "/images/sabrinna-ringquist-2z7MxnXQs3k-unsplash.jpg",
    name: "ACT Reading",
    category: "SAT",
    teacher: "Example Teacher",
    capacity: 15,
  }
]
  
  export async function getProductById (id) {
    return data.find(product => product.id === id)
  }
  
  export async function getProducts () {
    return data
  }
  