import * as React from 'react';
import { useSelector } from 'vs-react-store';

import { selectVolume } from 'store/selectors';

type Props = {
  gainNode: GainNode;
};

const TriggerVolume: React.FC<Props> = React.memo(
  (props) => {
    const volume = useSelector(selectVolume);

    React.useEffect(
      () => {
        if (props.gainNode) {
          props.gainNode.gain.value = volume;
        }
      },
      [props.gainNode, volume],
    );

    return null;
  },
);

export default TriggerVolume;
