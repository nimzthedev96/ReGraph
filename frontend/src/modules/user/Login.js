import { useState } from "react";
import { Form } from "react-bootstrap";
import "./Login.css";
import { useAuth } from "../../context/AuthContext";
import { useAlert } from "../../context/AlertContext";
import BasicButton from "../../components/BasicButton";

function Login(params) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const { showAlert } = useAlert();
  const { setPage, setPopUp } = params;

  const validateForm = () => {
    const newErrors = {};

    /* First check email */
    if (!email) newErrors.email = "Please enter your email address";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!password) newErrors.password = "Please enter your password";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    return newErrors;
  };

  const loginSubmit = async (e) => {
    e.preventDefault();
    let formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      const loginSuccess = await login(email, password);
      if (loginSuccess) {
        setPage("home");
        setPopUp("");
      } else {
        showAlert("Login failed, please check your credentials.", "danger");
        setPage("landing");
      }
    }
  };

  return (
    <div>
      <div className="wrapper">
        <div className="login-form-container">
          <h2 className="login-title">Login</h2>
          <Form className="login-form">
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password}
              </Form.Control.Feedback>
            </Form.Group>
            <BasicButton
              btnClass="btnLoginRegister"
              btnLabel="Login"
              btnOnClick={loginSubmit}
            />
            <BasicButton
              btnClass="btnLoginRegister"
              btnLabel="Cancel"
              btnOnClick={() => setPopUp("")}
            />
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
