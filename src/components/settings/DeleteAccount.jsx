import { motion } from "framer-motion";

const DeleteAccount = () => {
  return (
    <motion.div
      className="bg-red-900 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-red-700 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <p className="text-gray-300 mb-4">
        Permanently delete your account and all of your content.
      </p>
      <button
        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded 
      transition duration-200"
      >
        Delete Account
      </button>
    </motion.div>
  );
};
export default DeleteAccount;
