import { createContext, useState, useContext } from "react";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type = "info") => {
    const id = Date.now(); // Unique ID for each alert
    let prevAlerts = alerts;
    setAlerts((prevAlerts) => [...prevAlerts, { id, message, type }]);
  };

  const clearAlert = (alertid) => {
    let prevAlerts = alerts;
    setAlerts(prevAlerts.filter((a) => a["id"] !== alertid));
  };

  return (
    <AlertContext.Provider value={{ alerts, showAlert, clearAlert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
