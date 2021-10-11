const videoSelectBtn = document.getElementById('videoSelectBtn');
videoSelectBtn.onclick = getVideoSources;

const { desktopCapturer, remote } = require('electron')
const { Menu } = remote;

// Get the available video sources 
async function getVideoSources(){
    const inputSources = await desktopCapturer.getSources({
        types: ['window', 'screen']
    });

    const videoOptionsMenu = Menu.buildFromTemplate(
        inputSources.map(source => {
            return {
                label: source.name, 
                click: () => selectSource(source)
            };
        })
    );

    videoOptionsMenu.popup();
}

let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

// Change the videoSource windows to record 
async function selectSource(source){
    
    videoSelectBtn.innerText = source.name;

    const contraints = {
        audio: false,
        video: {
            mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: source.id
            }
        }
    };

    // Create a Stream 
    const stream = await navigator.mediaDevices.getUserMedia(contraints);
    
    // Preview the source in a video element
    videoElement.srcObject = stream;    
    videoElement.play();

    // Create the Media Recorder
    const options = { mimetype: 'video/webm; code=vp9'};
    mediaRecorder = new MediaRecorder(stream, options);

    //Register Event Handlers
    mediaRecorder.ondataavailable = handleDataAvailable;
    mediaRecorder.onstop = handleStop;
}
