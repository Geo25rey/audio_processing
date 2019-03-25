/**
 * util Object Package
 *      Creates a util object in the global window object containing utility 
 *      functions and constants
 *
 * @function atobarr(dataURI)
 *      Similar to the atob function, this function converts base64 data into a
 *      more usable form. In this case, it converts the data to an ArrayBuffer 
 *      containing the binary representation of dataURI. Note: This does not
 *      alter dataURI in anyway, and the ArrayBuffer is a complete copy of 
 *      dataURI.
 *
 *      @param dataURI
 *          base64 data to be converted into binary
 *
 *      @return
 *          ArrayBuffer containing binary representation of dataURI
 */
const util = {
	__proto__: {
		atobarr: function atobarr(dataURI) {
			const BASE64_MARKER = ';base64,';
			const base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
			const base64 = dataURI.substring(base64Index);
			const raw = atob(base64);
			const rawLength = raw.length;
			var result = new ArrayBuffer(rawLength);
			var array = new Uint8Array(result);

			for (var i = 0; i < rawLength; i++) {
				array[i] = raw.charCodeAt(i);
			}
			return result;
		}
	}
};