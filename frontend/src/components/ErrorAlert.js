import Alert from "react-bootstrap/Alert";
import { useAlert } from "../context/AlertContext";

const ErrorAlert = () => {
  const { alerts, clearAlert } = useAlert();

  if (alerts) {
    return (
      <div style={{ zIndex: 1, width: "50%" }}>
        {alerts.map((alert) => (
          <Alert
            variant={alert.type}
            onClose={() => clearAlert(alert.id)}
            dismissible
          >
            {alert.message}
          </Alert>
        ))}
      </div>
    );
  }

  return null;
};

export default ErrorAlert;
