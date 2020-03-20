import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';

import TrackLine from 'components/ui/atoms/track_line/TrackLine';
import { selectActiveTrackIndex, selectTrackList } from 'store/selectors';
import { changeActiveTrackIndex, removeTrackFromTrackList } from 'store/actions';

type Props = {};

const TrackList: React.FC<Props> = React.memo(
  (props) => {
    const track_list = useSelector(selectTrackList);
    const active_track_index = useSelector(selectActiveTrackIndex);
    const dispatch = useDispatch();

    const handleSetActiveTrackIndex = React.useCallback(
      (active_track_index_new: number) => {
        dispatch(
          changeActiveTrackIndex(active_track_index_new)
        );
      },
      [],
    );

    const handleRemoveTrack = React.useCallback(
      (file_or_index: Parameters<typeof removeTrackFromTrackList>[0]) => {
        dispatch(
          removeTrackFromTrackList(file_or_index),
        );
      },
      [],
    );

    return (
      <ul>
        {
          track_list.map((trackData, index) => (
            <li key={trackData.trackFile.name}>
              <TrackLine
                isActive={active_track_index === index}
                index={index}
                setActiveIndex={handleSetActiveTrackIndex}
                trackData={trackData}
                handleRemoveTrack={handleRemoveTrack}
              />
            </li>
          ))
        }
      </ul>

    );
  },
);

export default TrackList;
