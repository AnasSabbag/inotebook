import React, { useState } from "react";
import AlertContext from "./alertContext";

const AlertState = (props) => {
  const state = {
    name: "anas",
    course: "cse",
  };

  const [alertInfo, setAlertInfo] = useState(null);

  const displayAlert = (alertMsg) => {
    setAlertInfo(alertMsg); // Set the alert state
    // Automatically clear the alert after 1.5 seconds
    setTimeout(() => {
      setAlertInfo(null);
    }, 1500);
  };

  return (
    <AlertContext.Provider value={{ state, displayAlert, alertInfo, setAlertInfo }}>
      {/* Render the alert here */}
      {alertInfo && (
        <div className={`alert alert-${alertInfo.type} alert-dismissible fade show`} role="alert">
          <strong>{alertInfo.type}</strong>: {alertInfo.msg}
        </div>
      )}
      
      {props.children}
    </AlertContext.Provider>
  );
};

export default AlertState;
