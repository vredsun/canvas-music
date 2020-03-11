import * as React from 'react';
import { useSelector } from 'vs-react-store';
import { selectStateOfPlayIsPrepare, selectAllBytes, selectLoaded } from 'store/selectors';
import Loading from 'components/ui/atoms/loading';
import styled from 'styled-components';

type Props = {};

const PercentContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);
`;

const LoadingByPrepare: React.FC<Props> = React.memo(
  (props) => {
    const isPrepare = useSelector(selectStateOfPlayIsPrepare);
    const all_bytes = useSelector(selectAllBytes);
    const loaded_bytes = useSelector(selectLoaded);

    return isPrepare && (
      <Loading overall backgroundColor="rgba(0, 0, 0, 0.25)">
        <PercentContainer>{all_bytes ? Number((loaded_bytes / all_bytes).toFixed(2)) * 100 : 0}%</PercentContainer>
      </Loading>
    );
  },
);

export default LoadingByPrepare;
