const api = import.meta.env.VITE_API;

export async function fetchAllProducts() {
  const res = await fetch(`${api}/products`);
  return res.json();
}

export async function postProducts(productData) {
  const res = await fetch(`${api}/products`, {
    method: "POST",
    body: JSON.stringify(productData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
}

export async function editProducts({ id, productData }) {
  const res = await fetch(`${api}/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res.json();
}

export async function deleteProduct(id) {
  await fetch(`${api}/products/${id}`, {
    method: "DELETE",
  });
}
