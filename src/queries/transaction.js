// Import hooks from react-query for data fetching and mutations
import { useQuery, useMutation } from "react-query";
// Import the Axios instance for making HTTP requests
import Ax from "../utils/Axios";

// AXIOS CALLS

// Function to delete a transaction by ID
const deleteTr = async (params) => {
  return await Ax.delete(`transaction/delete/${params}`); // Send a DELETE request to the backend
};

// Function to fetch transactions with optional filters and pagination
const getTrs = async (params) => {
  return await Ax.get("transactions", { params: params }); // Send a GET request with query parameters
};

// Function to create a new transaction
const postTr = async (params) => {
  return await Ax.post("transaction", params); // Send a POST request with the transaction data
};

// REACT-QUERY HOOKS

// Hook to delete a transaction
const useTrasactionDelete = () => useMutation("deleteTr", deleteTr);

// Hook to fetch transactions with react-query
const useTransactionsGet = ({
  firstDate, // Filter by the first date
  lastDate, // Filter by the last date
  category, // Filter by category
  dateSort, // Sort by date (ascending/descending)
  priceSort, // Sort by price (ascending/descending)
  skip, // Number of records to skip (for pagination)
  take, // Number of records to take (for pagination)
  key, // Unique key for caching the query
  enabled, // Whether the query is enabled
}) =>
  useQuery(
    key, // Unique key for the query
    () =>
      getTrs({
        firstDate,
        lastDate,
        category,
        dateSort,
        priceSort,
        skip,
        take,
      }), // Fetch transactions with the specified parameters
    {
      refetchOnWindowFocus: false, // Do not refetch data when the window regains focus
      enabled: enabled || false, // Enable or disable the query based on the `enabled` flag
      keepPreviousData: true, // Keep the previous data while fetching new data
    }
  );

// Hook to create a new transaction
const useTransactionPost = () => useMutation("postTransaction", postTr);

// Export the hooks for use in other parts of the application
export { useTransactionsGet, useTrasactionDelete, useTransactionPost };
