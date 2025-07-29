import { Navbar, Nav, Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import BasicButton from "./BasicButton";
import logo2 from "../logo_dark_small.svg";

const Menu = (props) => {
  const { isAuthenticated, logout } = useAuth();
  const { setPage, setPopUp } = props;

  return (
    <div>
      <Navbar bg="dark" expand="lg">
        <Container>
          <Navbar.Brand>
            <img
              src={logo2}
              width="120px"
              height="auto"
              style={{ top: 0, left: 0 }}
            />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              {isAuthenticated ? (
                <div>
                  <BasicButton
                    btnClass="btnPrimaryMenu"
                    btnLabel="Home"
                    btnOnClick={() => setPage("home")}
                  />

                  <BasicButton
                    btnClass="btnPrimaryMenu"
                    btnLabel="Profile"
                    btnOnClick={() => console.log("Profile")}
                    btnStyle={{ position: "absolute", right: 100 }}
                  />

                  <BasicButton
                    btnClass="btnPrimaryMenu"
                    btnLabel="Logout"
                    btnOnClick={() => {
                      logout();
                      setPage("landing");
                      setPopUp("");
                    }}
                    btnStyle={{ position: "absolute", right: 20 }}
                  />
                </div>
              ) : (
                <div>
                  <BasicButton
                    btnClass="btnPrimaryMenu"
                    btnLabel="Login"
                    btnOnClick={() => setPopUp("login")}
                    btnStyle={{ position: "absolute", right: 20 }}
                  />
                  <BasicButton
                    btnClass="btnPrimaryMenu"
                    btnLabel="Register"
                    btnOnClick={() => setPopUp("register")}
                    btnStyle={{ position: "absolute", right: 100 }}
                  />
                </div>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default Menu;
