import * as React from 'react';

import TrackList from 'components/ui/molecules/track_list/TrackList';
import InputTrack from 'components/ui/molecules/input_track/InputTrack';

type Props = {};

const TrackListControl: React.FC<Props> = React.memo(
  () => {
    return (
      <div>
        <InputTrack />
        <TrackList />
      </div>
    );
  },
);

export default TrackListControl;
