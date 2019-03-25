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
 *		BECAUSE
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
function AudioRecorder(dataReadyCallback, microphonePermissionCallback) {
	var result = {
		dataavailable: null,
		data: null,
		audio: null,
		isRecording: false
	};
	var mediaRecorder;

	if (typeof(microphonePermissionCallback) !== 'function')
		throw new Error();
	if (microphonePermissionCallback.length !== 0)
		throw new Error();
	
	if (typeof(dataReadyCallback) !== 'function')
		throw new Error();
	if (dataReadyCallback.length !== 1)
		throw new Error();
	result.dataavailable = dataReadyCallback;

	const readers = [];
	function addReader() {
		readers.push(new FileReader());
		readers[readers.length - 1].addEventListener("loadend", (e) => {
			result.data = e.srcElement.result;
			result.dataavailable(result.data);
		});
	}
	addReader();

	AudioRecorder.prototype.getPreviousRecordingData = function getPreviousRecordingData() {
		if (result.dataavailable)
			return result.data;
		else
			throw new Error("Data is unavailable. Try calling later next time");
	};

	// AudioRecorder.prototype.getAudioElement = function getAudioElement() {
	// 	if (result.dataavailable) {
	// 		let audio = new Audio();
	// 		audio.src = result.audio.src;
	// 		return audio;
	// 	} else
	// 		throw new Error("Data is unavailable. Try calling later next time");
	// };

	AudioRecorder.prototype.isDataAvailable = function isDataAvailable() {
		return result.dataavailable;
	};

	AudioRecorder.prototype.startRecording = function startRecording(interval) {
		if (!result.isRecording) {
			result.isRecording = true;
			mediaRecorder.start(interval);
		} else
			throw new Error("Recording has already started. Stop recording " +
				"before starting again.");
	};

	AudioRecorder.prototype.stopRecording = function stopRecording() {
		if (result.isRecording) {
			result.isRecording = false;
			mediaRecorder.stop();
		} else
			throw new Error("Recording has not been started yet. Start " +
				"recording before stopping.");

	};

	// Requests microphone and initializes media recorder with event listeners
	navigator.mediaDevices.getUserMedia({
		audio: true
	}).then(stream => {		
		const options = {
			mimeType: 'audio/webm'
		};
		mediaRecorder = new MediaRecorder(stream, options);

		// const audioChunks = [];
		mediaRecorder.addEventListener("dataavailable", event => {
			// audioChunks.push(event.data);
			for (let reader of readers)
				try {
					reader.readAsDataURL(event.data);
					break;
				} catch (e) {
					if (reader === readers[readers.length - 1])
						addReader();
				}
		});

		// mediaRecorder.addEventListener("stop", () => {
		// 	const audioBlob = new Blob(audioChunks);
		// 	const audioUrl = URL.createObjectURL(audioBlob);
		// 	result.audio = new Audio(audioUrl);
		// });
		microphonePermissionCallback();
	});
}