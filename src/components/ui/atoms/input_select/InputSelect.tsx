import * as React from 'react';

type Props = {
  label?: string;

  rangeFrom: number;
  rangeTo: number;
  rangeStep: number;
  generateRange?: () => Array<(string | number)>;
  onChange: (value: number) => void;
  value: number;
};

const InputSelect: React.FC<Props> = React.memo(
  (props) => {
    const handleChange = React.useCallback(
      (event: React.ChangeEvent<HTMLSelectElement>) => {
        props.onChange(Number(event.target.value));
      },
      [props.onChange],
    );

    const optionsArr = React.useMemo(
      () => {
        let arr = [];

        if (props.generateRange) {
          arr = props.generateRange();
        } else {
          for (let tempValue = props.rangeFrom; tempValue <= props.rangeTo; tempValue += props.rangeStep) {
            arr.push(tempValue);
          }
        }
        return arr;
      },
      [props.rangeFrom, props.rangeTo, props.rangeStep],
    );

    return (
      <label>
        {props.label}
        <select onChange={handleChange} value={props.value}>
          {
            optionsArr.map((rowData) => (
              <option key={rowData} value={rowData}>{rowData}</option>
            ))
          }
        </select>
      </label>
    );
  },
);

export default InputSelect;
