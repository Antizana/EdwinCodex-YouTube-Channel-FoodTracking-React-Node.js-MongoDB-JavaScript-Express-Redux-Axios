/**
 *  @fileoverview Prompt Modal Windows for React
 */
import React, { useRef } from "react";
import { Modal, Button, FormControl } from "react-bootstrap";
import { confirmable, createConfirmation } from "react-confirm";

/**
 * Prompt Modal Window
 *   @props {proceedLabel1} String - Label for the first
 *     action button. Default value "Ok"
 *   @props {proceedLabel2} String - Label for the second
 *     action button. If its value is null the 2nd button
 *     won't be displayed.
 *   @props {proceedLabel3} String - Label for the third
 *     action button. If its value is null the 3rd button
 *     won't be displayed.
 *   @props {cancelLabel} String - Label for the Cancel button
 *   @props {title} String - Title set in the top window area
 *   @props {message} String - Body text in the modal
 *     window
 *   @props {show} bool - When true The modal will show
 *     itself. Default value false.
 *   @props {proceed} func - A callback fired when one of the
 *     three action buttons is selected. Proceed is called
 *     with the button number pressed 1, 2 or 3 and with the
 *     value typed.
 *   @props {dismiss} func - A callback fired when the header
 *     closeButton or non-static backdrop is clicked.
 *     Required if either are specified.
 *   @props {cancel} func - A callback fired when the cancel
 *     buttons is selected.
 *   @props {enableEscape} bool - By default is true. if true
 *     Close the modal when escape key is pressed
 *
 *   @return {string} Returns the value entered if some
 *     proceed button was selected, "" otherwise
 */
export const PromptModalWindow = (props) => {
  const inputRef = useRef();
  const {
    proceedLabel1 = "Ok",
    proceedLabel2,
    proceedLabel3,
    cancelLabel,
    title,
    message,
    show,
    proceed,
    dismiss,
    cancel,
  } = props;

  const handleOnClick = (index) => {
    return () => {
      proceed({
        button: index,
        input: inputRef.current.value,
      });
    };
  };

  return (
    <div className="static-modal">
      <Modal show={show} onHide={dismiss}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <FormControl type="text" ref={inputRef} />
          <Button onClick={cancel}>{cancelLabel}</Button>
          {proceedLabel1 && (
            <Button
              className="button-l"
              bsStyle="default"
              onClick={handleOnClick(1)}
            >
              {proceedLabel1}
            </Button>
          )}
          {proceedLabel2 && (
            <Button
              className="button-l"
              bsStyle="default"
              onClick={handleOnClick(2)}
            >
              {proceedLabel2}
            </Button>
          )}
          {proceedLabel3 && (
            <Button
              className="button-l"
              bsStyle="default"
              onClick={handleOnClick(3)}
            >
              {proceedLabel3}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

/**
 * Simple Prompt Dialog Window, shows a descriptive
 *    prompt modal window, with a prompt value and Ok
 *    and Cancel buttons.
 * @props {message} String - Body text in the modal
 *   window
 * @props {cancelLabel} String - Label for the Cancel button
 * @props {proceedLabel1} String - Label for the Ok button
 * @props options - see function PromptModalWindow parameter
 *   description
 */
export const modalPrompt = (
  message,
  cancelLabel = "Cancel",
  proceedLabel1 = "Ok",
  options = {}
) => {
  return createConfirmation(confirmable(PromptModalWindow))({
    message,
    proceedLabel1,
    cancelLabel,
    ...options,
  });
};
