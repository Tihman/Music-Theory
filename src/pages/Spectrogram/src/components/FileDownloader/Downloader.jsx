import React from 'react';
import { Button, Tooltip } from 'antd';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

export const Downloader = (props) => {
    return (
        <Tooltip title='download image'>
            <Button
                {...props}
                onClick={props.handleDownload}
                size='small'
                shape='circle'
                icon=<FileDownloadIcon fontSize='small'/>
            />
        </Tooltip>
    )
}