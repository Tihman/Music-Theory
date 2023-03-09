import React from 'react';
import { Uploader, Downloader, PlaybackCtrl } from '../';
import { List, Button } from 'antd';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
export const FileList = (props) => {
    const {
        onUploadSuccess,
        handleSelect,
        handlePlayback,
        isPlaying,
        selectedFile,
        dataSource,
        handleDownload
    } = props;
    return (
        <List
            style={props.style}
            header={
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-evenly', }}>
                        <Uploader onUploadSuccess={onUploadSuccess} />
                        <Downloader handleDownload={handleDownload} />
                        <PlaybackCtrl
                            handlePlayback={handlePlayback}
                            isPlaying={isPlaying}
                        />    
                    </div>
                </div>
            }
            bordered
            dataSource={dataSource}
            renderItem={file => (
                <List.Item>
                    <Button
                        block
                        style={{ margin: '0 auto'}}
                        onClick={() => handleSelect(file)}>
                        <List.Item.Meta
                            avatar={<MusicNoteIcon/>}
                            title={
                                <span>
                                    {
                                        file.source ?
                                            <span>
                                                <a href={file.source} target='_blank'>{file.name}</a> by {file.author.name}
                                            </span>
                                            : file.name
                                    }
                                </span>
                            }
                        />
                    </Button>
                </List.Item>
            )}
        />
    )
}