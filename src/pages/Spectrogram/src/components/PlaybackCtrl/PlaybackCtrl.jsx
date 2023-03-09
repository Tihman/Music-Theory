import React from 'react';
import { Button, Tooltip } from 'antd';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

export const PlaybackCtrl = (props) => {
    return (
        <Tooltip title={props.isPlaying ? 'pause' : 'play'}>
            <Button
                {...props}
                size='small'
                shape='circle'
                icon={props.isPlaying ? <PauseIcon fontSize='small'/> : <PlayArrowIcon fontSize='small'/> }
                onClick={props.handlePlayback}
            />
        </Tooltip>
    )
}