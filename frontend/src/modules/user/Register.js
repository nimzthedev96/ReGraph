import { useState } from "react";
import { Form } from "react-bootstrap";
import "./Register.css";
import { useAlert } from "../../context/AlertContext";
import BasicButton from "../../components/BasicButton";

function Register(params) {
  const [email, setEmail] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [errors, setErrors] = useState({});

  const { showAlert } = useAlert();

  const { setPage, setPopUp } = params;

  const validateForm = () => {
    const newErrors = {};

    if (!email) newErrors.email = "Please enter your email address";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";

    if (!firstname) newErrors.firstname = "Please enter your first name";
    if (!lastname) newErrors.lastname = "Please enter your last name";

    if (!password) newErrors.password = "Please enter your password";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    if (!repeatPassword)
      newErrors.repeatPassword = "Please re-enter your password";
    else if (password != repeatPassword)
      newErrors.repeatPassword = "Passwords must match";

    return newErrors;
  };

  const registerSubmit = async (e) => {
    e.preventDefault();
    let formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      // Send to backend
      try {
        const response = await fetch(
          "http://localhost:3002/user/registerUser",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              firstName: firstname,
              lastName: lastname,
              email: email,
              password: password,
            }),
          }
        );

        const data = await response.json();

        if (data.message && data.message == "Success") {
          showAlert(
            "User successfully registered! Please enter your login credentials",
            "success"
          );
          setPage("landing");
          setPopUp("login");
        } else {
        }
      } catch (e) {
        showAlert("User registration failed: " + e, "danger");
      }
    }
  };

  return (
    <div>
      <div className="wrapper">
        <div className="register-form-container">
          <h2 className="register-title">Register</h2>
          <Form onSubmit={registerSubmit} className="register-form">
            <Form.Group className="mb-3" controlId="formRegisterName">
              <Form.Label>First name</Form.Label>
              <Form.Control
                type="text"
                placeholder="First name"
                value={firstname}
                onChange={(e) => setFirstname(e.target.value)}
                isInvalid={!!errors.firstname}
              />
              <Form.Control.Feedback type="invalid">
                {errors.firstname}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterLastName">
              <Form.Label>Last name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Last name"
                value={lastname}
                onChange={(e) => setLastname(e.target.value)}
                isInvalid={!!errors.lastname}
              />
              <Form.Control.Feedback type="invalid">
                {errors.lastname}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formRegisterEmail">
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

            <Form.Group className="mb-3" controlId="formRegisterPassword">
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
            <Form.Group className="mb-3" controlId="formRegisterRepeatPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Repeat password"
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                isInvalid={!!errors.repeatPassword}
              />
              <Form.Control.Feedback type="invalid">
                {errors.repeatPassword}
              </Form.Control.Feedback>
            </Form.Group>
            <BasicButton
              btnClass="btnLoginRegister"
              btnLabel="Register"
              btnOnClick={registerSubmit}
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

export default Register;
