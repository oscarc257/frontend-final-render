import styles from "../styles/Auth.module.scss";
import MainContainer from "../components/Containers/MainContainer";
import { Title } from "../components/Titles/Titles";
import { useLoginUser } from "../queries/user";
import { useRegisterUser } from "../queries/user";
import { Link } from "react-router-dom";
import { queryClient } from "../constants/config";
import Spinner from "../components/Spinner";
import { useState } from "react";

const Error = ({ error }) => {
  return (
    <span style={{ color: "red", marginBottom: "1rem" }}>{error && error}</span>
  );
};

const Register = () => {
  const { mutateAsync: loginHandler, isLoading: loggingIn } = useLoginUser();
  const { mutate: registerUser, isLoading: registering } = useRegisterUser();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [validating, setValidating] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName || formData.firstName.length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    } else if (formData.firstName.length > 20) {
      newErrors.firstName = "First name must be at most 20 characters";
    }

    if (!formData.lastName || formData.lastName.length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    } else if (formData.lastName.length > 20) {
      newErrors.lastName = "Last name must be at most 20 characters";
    }

    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid Email";
    }

    if (!formData.password || formData.password.length < 3) {
      newErrors.password = "Password must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidating(true);

    if (validateForm()) {
      registerUser(formData, {
        onSuccess: async () => {
          await loginHandler({
            email: formData.email,
            password: formData.password,
          });
          queryClient.invalidateQueries("user");
        },
      });
    }

    setValidating(false);
  };

  return (
    <MainContainer>
      {/* REGISTER FORM */}
      <form
        action="submit"
        onSubmit={handleSubmit}
        className={styles.registerForm}
      >
        <div className={styles.container}>
          <Title>Register</Title>
          <span>First Name :</span>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          <Error error={errors?.firstName} />
          <span>Last Name :</span>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          <Error error={errors?.lastName} />
          <span>Email :</span>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <Error error={errors?.email} />
          <span>Password :</span>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Error error={errors?.password} />

          {/* REGISTER BTN */}
          <button type="submit">Register Now</button>
        </div>
        <Link to="/auth" style={{ textAlign: "center" }}>
          Already have an acc?
        </Link>
      </form>
      {(validating || registering || loggingIn) && <Spinner fullPage />}
    </MainContainer>
  );
};

export default Register;
