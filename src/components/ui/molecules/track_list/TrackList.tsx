import * as React from 'react';
import TrackLine from 'components/ui/atoms/track_line/TrackLine';

type Props = {
  activeTrackIndex: number;
  trackList: Array<File>;
  handleRemoveTrack: (file: File) => void;
  setActivetrackIndex: (index: number) => void;
};

const TrackList: React.FC<Props> = React.memo(
  (props) => {
    return (
      <ul>
        {
          props.trackList.map((trackData, index) => (
            <li key={trackData.name}>
              <TrackLine
                isActive={props.activeTrackIndex === index}
                index={index}
                setActiveIndex={props.setActivetrackIndex}
                trackData={trackData}
                handleRemoveTrack={props.handleRemoveTrack}
              />
            </li>
          ))
        }
      </ul>

    );
  },
);

export default TrackList;
