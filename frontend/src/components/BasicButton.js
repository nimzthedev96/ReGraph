/* 
  Basic button component
  
  This component is a basic button that we use all over the app. It is a 
  wrapper of react bootstraps button.
*/

import { Button } from "react-bootstrap";

function BasicButton(props) {
  const { btnLabel, btnOnClick, btnClass, btnStyle } = props;

  return (
    <Button className={btnClass} onClick={btnOnClick} style={btnStyle}>
      {btnLabel}
    </Button>
  );
}

export default BasicButton;
