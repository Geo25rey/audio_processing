/**
 * AudioRecorder Constructor Function
 *      Provides a method of recording audio and stores the audio for further
 *      processing and/or playback
 * 
 * @param dataReadyCallback
 * 		When finished extracting audio data call callback
 *
 * @param microphonePermissionCallback
 * 		When user gives permission to microphone call callback
 * 
 * @throws Error
 *		An error occures when improper callbacks are passed in
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
function AudioRecorder(dataReadyCallback, microphonePermissionCallback) {
    // Imports
    const AudioContext = window.AudioContext || window.webkitAudioContext;

	let isRecording = false;
    let audioContext = new AudioContext();

	if (typeof(microphonePermissionCallback) !== 'function')
		throw new Error();
	if (microphonePermissionCallback.length !== 0)
		throw new Error();
	
	if (typeof(dataReadyCallback) !== 'function')
		throw new Error();
	if (dataReadyCallback.length !== 3)
		throw new Error();

	AudioRecorder.prototype.startRecording = function startRecording() {
		if (!isRecording) {
			isRecording = true;
			audioContext.resume();
		} else
			throw new Error("Recording has already started. Stop recording " +
				"before starting again.");
	};

	AudioRecorder.prototype.stopRecording = function stopRecording() {
		if (isRecording) {
			isRecording = false;
			audioContext.suspend();
		} else
			throw new Error("Recording has not been started yet. Start " +
				"recording before stopping.");

	};

    let handleSuccess = function(stream) {
        let context = audioContext;
        let source = context.createMediaStreamSource(stream);
        let processor = context.createScriptProcessor(256, 1, 1); // 2^8

        source.connect(processor);
        processor.connect(context.destination);

        context.suspend();
        isRecording = false;

        processor.onaudioprocess = function(e) {
            for (let i = 0; i < e.inputBuffer.numberOfChannels; ++i)
                dataReadyCallback(i, e.inputBuffer.getChannelData(i), e.inputBuffer);
        };
        microphonePermissionCallback();
    };

    // Requests microphone and initializes media recorder with event listeners
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(handleSuccess);
}
