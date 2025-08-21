/* 
  ErrorAlert component
  
  This component shows alerts for success or error messages. It is a wrapper
  of the react-bootstrap alert. It uses state to determine whether to show or not.
  If we have multiple alerts, it will show each one.

  Used in conjunction with context/AlertContext.js
*/

import Alert from "react-bootstrap/Alert";
import { useAlert } from "../context/AlertContext";

const ErrorAlert = () => {
  const { alerts, clearAlert } = useAlert();

  return (
    <div className="alertContainer">
      {alerts
        ? alerts.map((alert) => (
            <Alert
              variant={alert.type}
              onClose={() => clearAlert(alert.id)}
              dismissible
            >
              {alert.message}
            </Alert>
          ))
        : null}
    </div>
  );
};

export default ErrorAlert;
