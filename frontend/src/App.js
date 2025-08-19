/* App.js
   
   Controls the entire single page application. 
   Renders our menu and footers, as well as determines which other
   components should be showing given the current state.
*/

import { useState } from "react";
import "./App.css";
import Login from "./modules/user/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "./logo_dark_large.svg";
import Footer from "./components/Footer";
import { AuthProvider } from "./context/AuthContext";
import { AlertProvider } from "./context/AlertContext";
import RunReport from "./modules/reporting/RunReport";
import Menu from "./components/Menu";
import Home from "./modules/reporting/Home";
import Register from "./modules/user/Register";
import ErrorAlert from "./components/ErrorAlert";

function App() {
  const [page, setPage] = useState("landing");
  const [popUp, setPopUp] = useState("");
  const [reportContext, setReportContext] = useState("");
  const [heading, setHeading] = useState(null);
  const [text, setText] = useState(null);

  return (
    <AlertProvider>
      <AuthProvider>
        <div className="App">
          <Menu setPage={setPage} setPopUp={setPopUp} />
          <ErrorAlert
            heading={heading}
            setHeading={setHeading}
            text={text}
            setText={setText}
          />
          {page == "landing" ? (
            <img
              src={logo}
              width="80%"
              height="auto"
              style={{ marginLeft: "5%" }}
            />
          ) : null}

          {page == "home" ? (
            <Home
              setPage={setPage}
              setPopUp={setPopUp}
              setReportContext={setReportContext}
            />
          ) : null}
          {page == "report" ? (
            <RunReport
              setPage={setPage}
              setPopUp={setPopUp}
              reportContext={reportContext}
              setReportContext={setReportContext}
            />
          ) : null}
          {popUp == "login" ? (
            <Login setPage={setPage} setPopUp={setPopUp} />
          ) : null}
          {popUp == "register" ? (
            <Register setPage={setPage} setPopUp={setPopUp} />
          ) : null}
          <Footer />
        </div>
      </AuthProvider>
    </AlertProvider>
  );
}

export default App;
