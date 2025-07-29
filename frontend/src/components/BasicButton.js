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
