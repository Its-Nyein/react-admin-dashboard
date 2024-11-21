const api = import.meta.env.VITE_API;

export async function fetchAllProducts() {
  const res = await fetch(`${api}/products`);
  return res.json();
}
