import * as React from 'react';
import CenterBox from 'components/ui/atoms/center_box/CenterBox';
import AppTitle from 'components/ui/templates/app_title/AppTitle';

type Props = {};

const PlayerControlWrap = React.lazy(() => (
  import(/* webpackChunkName: "@PlayerControlWrap" */ 'components/ui/templates/player_control/PlayerControlWrap')
));

const MainPage: React.FC<Props> = React.memo(
  () => {
    return (
      <CenterBox>
        <AppTitle />
        <React.Suspense fallback={<div></div>}>
          <PlayerControlWrap />
        </React.Suspense>
      </CenterBox>
    );
  },
);

export default MainPage;
