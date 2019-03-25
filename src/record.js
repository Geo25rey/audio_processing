/**
 * AudioRecorder Constructor Function
 *      Provides a method of recording audio and stores the audio for further
 *      processing and/or playback
 *
 * @function getRecordingData()
 *      Returns a copy of the data saved during the recording
 *
 *      @throws Error
 *          An error occures when trying to access the recorded data before the
 *          recording has finished completely
 *
 * @function getAudioElement()
 *      Returns a copy of the audio element with the data saved during the 
 *      recording as the audio source
 *
 *      @throws Error
 *          An error occures when trying to access the recorded data before the
 *          recording has finished completely
 *
 * @function isDataAvailable()
 *      Returns true if and only if the recorded audio is ready to be processed
 *      or played
 *
 * @function startRecording()
 *      Starts the recording
 *
 *      @throws Error
 *          An error occures when the recording has already started
 *
 * @function stopRecording()
 *      Stops the recording
 *
 *      @throws Error
 *          An error occures when the recording has not been started
 *          
 */
function AudioRecorder() { 
    var result = { dataavailable: false, data: null, audio: null, 
        isRecording: false };
    var mediaRecorder;

    AudioRecorder.prototype.getRecordingData = function getRecordingData() {
        if (result.dataavailable)
            return JSON.parse(JSON.stringify(result.data));
        else
            throw new Error("Data is unavailable. Try calling later next time");
    };

    AudioRecorder.prototype.getAudioElement = function getAudioElement() {
        if (result.dataavailable) {
            return JSON.parse(JSON.stringify(result.audio));
        } else
            throw new Error("Data is unavailable. Try calling later next time");
    };

    AudioRecorder.prototype.isDataAvailable = function isDataAvailable() {
        return result.dataavailable;
    };

    AudioRecorder.prototype.startRecording = function startRecording() {
        if (!result.isRecording) 
            mediaRecorder.start(); 
        else
            throw new Error("Recording has already started. Stop recording " +
                "before starting again.");
    };

    AudioRecorder.prototype.stopRecording = function stopRecording() {
        if (result.isRecording) 
            mediaRecorder.stop(); 
        else
            throw new Error("Recording has not been started yet. Start " +
                "recording before stopping.");
    };

    // Requests microphone and initializes media recorder with event listeners
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => { 
        const reader = new FileReader();
        reader.addEventListener("loadend", (e) => {
            result.dataavailable = true;
            result.data = e.srcElement.result;
        });

        const options = {mimeType: 'audio/webm;codecs=vp9'};
        mediaRecorder = new MediaRecorder(stream, options);

        const audioChunks = [];
        mediaRecorder.addEventListener("dataavailable", event => {
            audioChunks.push(event.data); 
        });

        mediaRecorder.addEventListener("start", () => {
            result.isRecording = true;
        });

        mediaRecorder.addEventListener("stop", () => {
            result.isRecording = false;
            const audioBlob = new Blob(audioChunks);
            reader.readAsDataURL(audioBlob);
            const audioUrl = URL.createObjectURL(audioBlob); 
            result.audio = new Audio(audioUrl);
        });
    });
}
