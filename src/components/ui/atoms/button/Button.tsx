import * as React from 'react';

type Props = {
  onClick: () => any;
  isDisabled?: boolean;
};

const Button: React.FC<Props> = React.memo(
  (props) => {

    return (
      <button
        onClick={props.onClick}
        disabled={props.isDisabled}
      >{props.children}</button>
    );
  },
);

export default Button;
