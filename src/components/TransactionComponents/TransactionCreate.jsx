// STYLES
import styles from "../../styles/TransactionComponents/TransactionCreate.module.scss";

// COMPONENTS
import { Title } from "../Titles/Titles"; // Title component for displaying the form title
import Spinner from "../Spinner"; // Spinner component for loading states

// UTILS
import { useCategoriesGet } from "../../queries/category"; // Hook to fetch categories
import { useTransactionPost } from "../../queries/transaction"; // Hook to post a transaction
import { queryClient } from "../../constants/config"; // Query client for cache invalidation
import { useState } from "react"; // React hook for managing state

// Error component to display validation errors
const Error = ({ error }) => {
  return (
    <>
      {error && (
        <span style={{ color: "red", marginBottom: "0.5rem" }}>{error}</span>
      )}
    </>
  );
};

// TransactionCreate component for creating a new transaction
const TransactionCreate = () => {
  // State to manage form data
  const [formData, setFormData] = useState({
    title: "",
    money: "",
    date: "",
    info: "",
    transactionCategoryId: "",
  });

  // State to manage validation errors
  const [errors, setErrors] = useState({});
  const [validating, setValidating] = useState(false); // State for validation/loading status

  // Hook to handle posting a transaction
  const {
    mutate: postTransaction,
    isLoading: postingTransaction,
    isSuccess: postedTransaction,
    isError: postingTransactionError,
    error: postingTransactionErr,
  } = useTransactionPost();

  // Hook to fetch categories
  const { data: ctgs, isFetched: ctgsFetched } = useCategoriesGet();

  // Function to validate the form data
  const validateForm = () => {
    const newErrors = {};

    // Validate title (minimum 2 characters)
    if (!formData.title || formData.title.length < 2) {
      newErrors.title = "Title must be at least 2 characters";
    }

    // Validate money (must be a positive number)
    const moneyValue = parseFloat(formData.money.trim());
    if (isNaN(moneyValue)) {
      newErrors.money = "Money must be a valid number";
      console.log("Money is NaN"); // Debugging log
    } else if (moneyValue <= 0) {
      newErrors.money = "Money must be greater than zero";
    }

    // Validate date (must not be empty)
    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    // Validate category (must not be empty)
    if (!formData.transactionCategoryId) {
      newErrors.transactionCategoryId = "Invalid Category";
    }

    setErrors(newErrors); // Update errors state
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Function to handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value })); // Update form data state
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    setValidating(true); // Set validating state to true

    // Validate the form before submitting
    if (validateForm()) {
      const payload = {
        ...formData,
        money: parseFloat(formData.money), // Convert money to a number
      };

      console.log("Submitting form data:", payload); // Log the payload for debugging
      postTransaction(payload, {
        onSuccess: () => {
          // Invalidate cache for categories after successful submission
          queryClient.invalidateQueries("Categories_Sum");
          // Reset the form data
          setFormData({
            title: "",
            money: "",
            date: "",
            info: "",
            transactionCategoryId: "",
          });
        },
      });
    }

    setValidating(false); // Reset validating state
  };

  return (
    <div className={styles.inner}>
      <form onSubmit={handleSubmit}>
        {/* Form title */}
        <Title>Add a Transaction</Title>

        {/* Title input */}
        <input
          type="text"
          name="title"
          placeholder="* Title"
          value={formData.title}
          onChange={handleChange}
        />
        <Error error={errors?.title} />

        {/* Money input */}
        <input
          type="number"
          name="money"
          step={0.01}
          placeholder="* Money"
          value={formData.money}
          onChange={handleChange}
        />
        <Error error={errors?.money} />

        {/* Date input */}
        <input
          type="date"
          name="date"
          placeholder="* Date"
          value={formData.date}
          onChange={handleChange}
        />
        <Error error={errors?.date} />

        {/* Info input */}
        <input
          type="text"
          name="info"
          placeholder="Information"
          value={formData.info}
          onChange={handleChange}
        />
        <Error error={errors?.info} />

        {/* Categories dropdown */}
        {ctgs && ctgsFetched ? (
          <>
            <select
              name="transactionCategoryId"
              value={formData.transactionCategoryId}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              {ctgs?.data?.ctgs?.map((ctg) => {
                return (
                  <option key={ctg.id} value={ctg.id}>
                    {ctg.name}
                  </option>
                );
              })}
            </select>
            <Error error={errors?.transactionCategoryId} />
          </>
        ) : (
          <div>loading...</div> // Show loading state while fetching categories
        )}

        {/* Submit button */}
        <button type="submit">Add Transaction</button>

        {/* Error and success messages */}
        <div style={{ marginBottom: "1rem" }}>
          {postingTransactionError ? (
            <div style={{ color: "red" }}>
              {postingTransactionErr?.response?.data?.message}
            </div>
          ) : null}
          {postedTransaction && <div style={{ color: "green" }}>Success</div>}
        </div>

        {/* Show spinner during loading or validation */}
        {(postingTransaction || validating) && <Spinner fullPage />}
      </form>
    </div>
  );
};

// Export the TransactionCreate component for use in other parts of the application
export default TransactionCreate;
