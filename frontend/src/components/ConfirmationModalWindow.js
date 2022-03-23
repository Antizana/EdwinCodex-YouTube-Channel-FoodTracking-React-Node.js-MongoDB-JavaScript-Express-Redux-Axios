/**
 * @fileoverview Confirmation Modal Windows for React
 */
import React from "react";

import { Modal, Button } from "react-bootstrap";
import { confirmable, createConfirmation } from "react-confirm";

/**
 * Confirmation Modal Window
 *   @props {proceedLabel} String - Label for the Ok button
 *   @props {cancelLabel} String - Label for the Cancel button
 *   @props {title} String - Title set in the top window area
 *   @props {confirmation} String - Body text in the modal
 *     window
 *   @props {show} bool - When true The modal will show
 *     itself. Default value false.
 *   @props {proceed} func - Function called with true value
 *     when proceed button is selected or with false value
 *     when cancel button is selected or the ESC Key is
 *     pressed
 *   @props {enableEscape} bool - By default is true. if true
 *     Close the modal when escape key is pressed
 *
 *   @return {boolean} true if the proceed button was
 *     selected, false otherwise
 */
export const Confirmation = (props) => {
  const {
    proceedLabel,
    cancelLabel,
    title,
    confirmation,
    show,
    proceed,
    enableEscape = true,
  } = props;

  return (
    <div className="static-modal">
      <Modal
        show={show}
        onHide={() => proceed(false)}
        backdrop={enableEscape ? true : "static"}
        keyboard={enableEscape}
      >
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmation}</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => proceed(false)}>{cancelLabel}</Button>
          <Button
            className="button-l"
            bsStyle="primary"
            onClick={() => proceed(true)}
          >
            {proceedLabel}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

/**
 * Simple Confirm Dialog Window, shows a descriptive
 *    confirmation, with Ok and Cancel buttons.
 * @props {confirmation} String - Body text in the modal
 *   window
 * @props {proceedLabel} String - Label for the Ok button
 * @props {cancelLabel} String - Label for the Cancel button
 * @props options - see function Confirmation parameter
 *   description
 */
export const modalConfirm = (
  confirmation,
  cancelLabel = "Cancel",
  proceedLabel = "Ok",
  options = {}
) => {
  return createConfirmation(confirmable(Confirmation))({
    confirmation,
    proceedLabel,
    cancelLabel,
    ...options,
  });
};
