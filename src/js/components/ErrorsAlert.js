import PropTypes from "prop-types";
import React from "react";

import Alert from "./Alert";
import { getUnanchoredErrorMessage } from "../utils/ErrorMessageUtil";

const ErrorsAlert = function(props) {
  const {
    errors,
    hideTopLevelErrors,
    hidePermissiveErrors,
    pathMapping
  } = props;
  let showErrors = [].concat.apply([], errors);

  if (hidePermissiveErrors) {
    showErrors = showErrors.filter(error => !error.isPermissive);
  }

  if (hideTopLevelErrors) {
    showErrors = showErrors.filter(function(error) {
      return error.path.length === 0;
    });
  }

  if (showErrors.length === 0) {
    return <noscript />;
  }

  // De-duplicate error messages that have exactly the same translated output
  const errorMessages = showErrors.reduce(function(messages, error) {
    const message = getUnanchoredErrorMessage(error, pathMapping);
    if (messages.indexOf(message) !== -1) {
      return messages;
    }

    messages.push(message);

    return messages;
  }, []);

  const errorItems = errorMessages.map((message, index) => {
    return (
      <li key={index}>
        {message}
      </li>
    );
  });

  return (
    <Alert>
      <h4>There is an error with your configuration</h4>
      <ul>
        {errorItems}
      </ul>
    </Alert>
  );
};

ErrorsAlert.defaultProps = {
  errors: [],
  hideTopLevelErrors: false,
  hidePermissiveErrors: true,
  pathMapping: []
};

ErrorsAlert.propTypes = {
  errors: PropTypes.array,
  hideTopLevelErrors: PropTypes.bool,
  hidePermissiveErrors: PropTypes.bool,
  pathMapping: PropTypes.array
};

module.exports = ErrorsAlert;
