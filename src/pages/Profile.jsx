import MainContainer from "../components/Containers/MainContainer";
import { Title } from "../components/Titles/Titles";
import { useUser, useUserUpdate, useUserDelete } from "../queries/user";
import styles from "../styles/profileComponents/Profile.module.scss";
import { useState, useEffect } from "react";
import { queryClient } from "../constants/config";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const nav = useNavigate();

  // Fetch user data
  const { data: user, isSuccess } = useUser();

  // Hooks for updating user info
  const {
    mutate: UserUpdate,
    isSuccess: userUpdated,
    isError: userNotUpdated,
    isLoading: userUpdating,
  } = useUserUpdate();

  // Hooks for deleting user
  const {
    mutate: UserDelete,
    isSuccess: userDeleted,
    isError: userNotDeleted,
    isLoading: userDeleting,
  } = useUserDelete();

  // State for form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  // Populate form fields with user data when loaded
  useEffect(() => {
    if (isSuccess) {
      try {
        setFirstName(user.data.firstName);
        setLastName(user.data.lastName);
      } catch {}
    }
  }, [isSuccess, user]);

  // Body for update request
  const body = {
    firstName: firstName,
    lastName: lastName,
  };

  return (
    <MainContainer>
      <div className={styles.container}>
        <Title>Profile</Title>
        {/* Profile update form */}
        <form action="submit" onSubmit={(e) => e.preventDefault()}>
          <div className={styles.formInner}>
            {/* FIRSTNAME */}
            <div className={styles.firstName}>
              <label htmlFor="firstName">First Name :</label>
              <input
                type="text"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            {/* LASTNAME */}
            <div className={styles.lastName}>
              <label htmlFor="lastName">Last Name : </label>
              <input
                type="text"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            {/* Update button */}
            <button onClick={() => UserUpdate(body)} disabled={userUpdating}>
              {userUpdating ? "Updating..." : "Update Info!"}
            </button>
            {/* Success/Error messages */}
            {userUpdated && (
              <div style={{ marginTop: "1rem", color: "green" }}>Success</div>
            )}
            {userNotUpdated && (
              <div style={{ marginTop: "1rem", color: "red" }}>Error</div>
            )}
          </div>
        </form>
        {/* Delete account button */}
        <button
          onClick={() =>
            UserDelete(null, {
              onSuccess: () => {
                // Clear all queries and mutations, then navigate to auth page
                queryClient.removeQueries();
                queryClient.cancelQueries();
                queryClient.cancelMutations();
                nav("/auth");
              },
            })
          }
          disabled={userDeleting}
          style={{ marginTop: "1rem" }}
        >
          {userDeleting ? "Deleting..." : "Delete Account"}
        </button>
      </div>
    </MainContainer>
  );
};

export default Profile;
