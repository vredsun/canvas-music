import * as React from 'react';

import TrackList from 'components/ui/molecules/track_list/TrackList';
import InputTrack from 'components/ui/molecules/input_track/InputTrack';

type Props = {
  activeTrackIndex: number;
  trackList: Array<File>;
  handleAddTrack: (files: Array<File>) => void;
  handleRemoveTrack: (file: File) => void;
  setActivetrackIndex: (index: number) => void;
};

const TrackListControl: React.FC<Props> = React.memo(
  (props) => {
    return (
      <div>
        <InputTrack handleAddTrack={props.handleAddTrack} />
        <TrackList
          activeTrackIndex={props.activeTrackIndex}
          trackList={props.trackList}
          handleRemoveTrack={props.handleRemoveTrack}
          setActivetrackIndex={props.setActivetrackIndex}
        />
      </div>

    );
  },
);

export default TrackListControl;
