import styles from "../../styles/CategoriesComponents/CategoryDelete.module.scss";
import { Title } from "../Titles/Titles";
import { queryClient } from "../../constants/config";
import { useState, useEffect } from "react";
import { useCategoriesGet, useCategoryDelete } from "../../queries/category";
import Spinner from "../../components/Spinner";

const CategoryDelete = () => {
  // Fetch categories and loading states
  const {
    data: ctgs,
    isLoading: ctgsLoading,
    isRefetching: ctgsRefetching,
    isSuccess: ctgsSuccess,
  } = useCategoriesGet();

  // State to hold the selected category id
  const [category, setCategory] = useState();

  // Mutation hook for deleting a category
  const { mutate: deleteCategory, isLoading: deletingCategory } =
    useCategoryDelete();

  // Set the default selected category when categories are loaded
  useEffect(() => {
    setCategory(ctgs?.data?.ctgs[0]?.id);
  }, [ctgs]);

  return (
    <div className={styles.categoryContainer}>
      {/* DELETE CTG */}
      <Title>Delete Category</Title>
      {/* Show form if categories exist and are loaded */}
      {ctgs?.data?.ctgs?.length > 0 &&
      ctgsSuccess &&
      !ctgsLoading &&
      !ctgsRefetching ? (
        <form onSubmit={(e) => e.preventDefault()}>
          {/* Category select dropdown */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {ctgs?.data?.ctgs?.map((category, index) => {
              return (
                <option key={index} value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
          {/* Delete button */}
          <button
            onClick={() =>
              deleteCategory(category, {
                onSuccess: () => {
                  // Invalidate categories query to refresh the list
                  queryClient.invalidateQueries("Categories");
                },
              })
            }
          >
            Delete Category
          </button>
        </form>
      ) : ctgsLoading || ctgsRefetching ? (
        // Show loading state
        <span>Loading Categories...</span>
      ) : (
        // Show message if no categories to delete
        <span>No Categories To Delete</span>
      )}
      {/* Show spinner while deleting */}
      {deletingCategory && <Spinner fullPage />}
    </div>
  );
};

export default CategoryDelete;
