/**
 * WebmDecoder Constructor Function
 *      Creates an object to parse and process data from a binary buffer 
 *      formated as a Webm media encoding (what Google Chrome uses by default)
 *
 * @param tagFunctions
 *      A dictionary of pairs of (tag name, function to be run when tag is found)
 *      If the dictionary is missing a tag name as a key, the key will be 
 *      automatically added to the dictionary.
 * 
 * @throws TypeError
 * 		data must be an ArrayBuffer
 *		tagFunctions must be an object
 *		if tagFunctions contains a valid tag key, the value must be a function 
 *			with only 1 parameter
 *
 * @function decode()
 *      Decodes the data passed into the constructor and runs the tagFunctions
 *      when appropriate
 * 		
 *		@param data
 *      	An ArrayBuffer containing the binary data
 * 
 * 		@throws TypeError
 * 			data must be an ArrayBuffer
 *
 */
function WebmDecoder(tagFunctions) {
	const func = (arg) => {};
    if (!tagFunctions || typeof(tagFunctions) !== 'object')
        throw new TypeError("tagFunctions must be a defined object");

    tagFunctions.__proto__ = null;
//    for (let tag in tagDictionary) {
//		tag = tagDictionary[tag];
//        tagFunctions[tag] = tagFunctions[tag] || func;
//        if (typeof(tagFunctions[tag]) !== 'function' ||
//                tagFunctions[tag].length !== 1)
//            throw new TypeError("tagFunctions[" + tag + "] must be a " + 
//                "function with one argument");
//    }

    WebmDecoder.prototype.decode = function decode(data) {
		if (!(data instanceof ArrayBuffer))
			throw new TypeError("data must be an ArrayBuffer");
		
		var readBytes = data.byteLength;
    	// console.log('readBytes=' + readBytes + "  " + addrHex(readBytes));
    	// console.log(' ');
		
        // --- parse webm ----
        WebmDecoderModule.ccall('parseWebm', 'number', 
            ['number', 'ArrayBuffer', 'number', 'number'], 
            [0, buffer, 0, readBytes]);
        // console.log('---- END ----- ');
    };
    // ============
}
