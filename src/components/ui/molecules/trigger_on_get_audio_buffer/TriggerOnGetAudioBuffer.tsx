import * as React from 'react';
import { useSelector, useDispatch } from 'vs-react-store';

import { selectCurrentTrack } from 'store/selectors';
import {
  changeStateOfPlayOnPrepare,
  changeLoadedBytes,
  changeTrackListOneTrack,
  changeStateOfPlayOnPlayFromStart,
} from 'store/actions';
import loadTrack from 'utils/load_track';

type Props = {};

const TriggerOnGetAudioBuffer: React.FC<Props> = React.memo(
  () => {
    const track = useSelector(selectCurrentTrack);

    const dispatch = useDispatch();

    React.useEffect(
      () => {
        if (track?.trackFile && !track.trackAudioBuffer) {
          const trackUrl = window.URL.createObjectURL(track.trackFile);

          dispatch(changeStateOfPlayOnPrepare());

          setImmediate(
            async () => {
              const trackAudioBufferNew = await loadTrack(
                trackUrl,
                (event) => {
                  dispatch(changeLoadedBytes(event.loaded, event.total));
                },
              );

              dispatch(
                changeTrackListOneTrack(track, { ...track, trackAudioBuffer: trackAudioBufferNew }),
              );
              dispatch(changeStateOfPlayOnPlayFromStart());
            }
          );
        }
      },
      [track],
    );

    return null;
  },
);

export default TriggerOnGetAudioBuffer;
