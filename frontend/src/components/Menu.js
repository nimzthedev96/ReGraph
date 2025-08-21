/* 
  Menu component
  
  This component contains the navigation bar on the top of every page. 
  Using a combination of the logged in state, and page state, we determine
  what menu options to show.
*/

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
            <Nav className="ms-auto">
              {isAuthenticated ? (
                <div>
                  <BasicButton
                    btnClass="btnPrimaryMenu"
                    btnLabel="Home"
                    btnOnClick={() => setPage("home")}
                  />
                  <BasicButton
                    btnClass="btnPrimaryMenu"
                    btnLabel="Logout"
                    btnOnClick={() => {
                      logout();
                      setPage("landing");
                      setPopUp("");
                    }}
                  />
                </div>
              ) : (
                <div>
                  <BasicButton
                    btnClass="btnPrimaryMenu"
                    btnLabel="Register"
                    btnOnClick={() => setPopUp("register")}
                  />
                  <BasicButton
                    btnClass="btnPrimaryMenu"
                    btnLabel="Login"
                    btnOnClick={() => setPopUp("login")}
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
