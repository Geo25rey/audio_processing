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
	if (dataReadyCallback.length !== 2)
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
        let processor = context.createScriptProcessor(1024, 1, 1); // 2^10
        let analyser = context.createAnalyser();

        source.connect(analyser);
//        processor.connect(analyser);
        analyser.connect(context.destination);

        context.suspend();
        isRecording = false;

        function run() {
            if (!isRecording)
                setTimeout(run, 0);
            var dataArray = new Float32Array(analyser.fftSize); // Float32Array needs to be the same length as the fftSize
            analyser.getFloatTimeDomainData(dataArray);
            var freqArray = new Float32Array(analyser.fftSize); // Float32Array needs to be the same length as the fftSize
            analyser.getFloatFrequencyData(freqArray);
            dataReadyCallback(dataArray, freqArray);
            setTimeout(run, 0);
        };
        run();
        microphonePermissionCallback();
    };

    // Requests microphone and initializes media recorder with event listeners
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(handleSuccess);
}
