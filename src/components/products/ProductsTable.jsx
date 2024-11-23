import { motion } from "framer-motion";
import { Edit, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { QueryClient, useMutation, useQuery } from "react-query";
import {
  deleteProduct,
  editProducts,
  fetchAllProducts,
  postProducts,
} from "../../libs/fetcher.js";

const ProductsTable = () => {
  const queryClient = new QueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProducts, setFilterProducts] = useState([]);
  const [showModel, setShowModel] = useState(false);
  const [showEditModel, setShowEditModel] = useState(null);
  const { isLoading, isError, error, data } = useQuery(
    "products",
    fetchAllProducts
  );

  const { mutate: createMutation } = useMutation(postProducts, {
    onMutate: async (updatedData) => {
      await queryClient.cancelQueries("products");
      await queryClient.setQueryData(["products"], (oldData = []) => {
        oldData.map((product) =>
          product.id === updatedData.id
            ? { ...product, ...updatedData }
            : product
        );
      });
      setShowModel(false);
    },
  });

  const { mutate: editMutation } = useMutation(editProducts, {
    onMutate: async (newProduct) => {
      await queryClient.cancelQueries("products");
      await queryClient.setQueryData(["products"], (oldData = []) => [
        newProduct,
        ...oldData,
      ]);
      setShowModel(false);
    },
  });

  const { mutate: deleteMutation } = useMutation(
    async (id) => deleteProduct(id),
    {
      onMutate: async (id) => {
        await queryClient.cancelQueries("products");
        await queryClient.setQueryData(["products"], (oldData = []) =>
          oldData.filter((old) => old.id !== id)
        );
      },
    }
  );

  useEffect(() => {
    if (data) {
      const filtered = data.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLocaleLowerCase()) ||
          product.category
            .toLowerCase()
            .includes(searchTerm.toLocaleLowerCase())
      );
      setFilterProducts(filtered);
    }
  }, [data, searchTerm]);

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
  };

  const handleOnCreate = () => {
    setShowModel(true);
    setShowEditModel(null);
  };

  const handleEditProduct = (product) => {
    setShowEditModel(product);
    setShowModel(true);
  };

  const handleOnDelete = (id) => {
    deleteMutation(id);
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const productData = {
      name: formData.get("name"),
      category: formData.get("category"),
      price: parseFloat(formData.get("price")),
      stock: parseInt(formData.get("stock")),
      sales: parseInt(formData.get("sales")),
    };

    if (showEditModel) {
      const productId = showEditModel.id;
      editMutation({ id: productId, productData });
    } else {
      createMutation(productData);
    }
  };

  const handleCloseModal = () => {
    setShowModel(false);
  };

  if (isLoading)
    return (
      <div className="mb-5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
        Loading...
      </div>
    );
  if (isError)
    return (
      <div className="mb-5 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
        Error: {error.message}
      </div>
    );

  return (
    <motion.div
      className="bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-3">
        <h2 className="text-xl font-semibold text-gray-100">Product List</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSearch}
            value={searchTerm}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
        <button
          className="bg-gray-700 text-white rounded-full p-2 focus:outline-none active:bg-gray-800 transition-colors duration-800 ease-in-out"
          onClick={handleOnCreate}
        >
          <Plus size={18} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Sales
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-700">
            {filterProducts.map((product) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100 flex gap-2 items-center">
                  {product.name}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.category}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  ${product.price}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.stock}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  {product.sales}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                  <button
                    className="text-indigo-400 hover:text-indigo-300 mr-2"
                    onClick={() => handleEditProduct(product)}
                  >
                    <Edit size={18} />
                  </button>
                  <button className="text-red-400 hover:text-red-300">
                    <Trash2
                      size={18}
                      onClick={() => handleOnDelete(product.id)}
                    />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
      {showModel && (
        <div className="absolute top-16 inset-0 -translate-y-1/2 z-50 bg-gray-800 bg-opacity-0 flex items-center justify-center">
          <div className="bg-gray-700 rounded-lg p-6 w-[550px]">
            <h2 className="text-xl text-center font-semibold text-gray-100">
              {showEditModel ? "Edit Product" : "Create Product"}
            </h2>
            <form className="gap-2" onSubmit={handleOnSubmit}>
              <div>
                <label htmlFor="name" className="text-gray-400">
                  Product Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  defaultValue={showEditModel?.name || ""}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="text-gray-400">
                  Category
                </label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  defaultValue={showEditModel?.category || ""}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label htmlFor="price" className="text-gray-400">
                  Price
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  defaultValue={showEditModel?.price || 0.0}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label htmlFor="stock" className="text-gray-400">
                  Stock
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  defaultValue={showEditModel?.stock || 0}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg"
                  required
                />
              </div>

              <div>
                <label htmlFor="sales" className="text-gray-400">
                  Sales
                </label>
                <input
                  type="number"
                  id="sales"
                  name="sales"
                  defaultValue={showEditModel?.sales || 0}
                  className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg"
                  required
                />
              </div>

              <div className="flex justify-end mt-1 gap-2">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-6 py-2 rounded-lg"
                >
                  {showEditModel ? "Update Product" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
};
export default ProductsTable;
