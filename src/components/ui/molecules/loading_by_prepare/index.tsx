import * as React from 'react';
import { useSelector } from 'vs-react-store';
import { selectStateOfPlayIsPrepare } from 'components/store/selectors';
import Loading from 'components/ui/atoms/loading';

type Props = {};

const LoadingByPrepare: React.FC<Props> = React.memo(
  (props) => {
    const isPrepare = useSelector(selectStateOfPlayIsPrepare);
    return isPrepare && (
      <Loading overall backgroundColor="rgba(0, 0, 0, 0.25)" />
    );
  },
);

export default LoadingByPrepare;
