#include <stdint.h>
#include <stdbool.h>
#include <stdio.h>

#include <dfa.h>

static struct Data {
    State name;
    uint64_t size;
    uint64_t value;
} data;

static bool scanWebmTag(void* buff, uint64_t pos);

static bool scanDataSize(void* buff, uint64_t pos);

static uint64_t scanDataValueU(void* buff, uint64_t pos, size_t size);

static void scanDataUTF8(void* buff, uint64_t pos, size_t size, char dest[]);

static double scanDataFloat(void* buff, uint64_t pos, size_t size);

static bool decodeBytes(void* buff, uint64_t pos, size_t size, uint8_t firstByte, uint8_t firstMask);

uint64_t parseWebm(uint8_t level, void* buffer, uint64_t position, uint64_t maxPosition) {
    while (position < maxPosition) {
        // -- ADDRESS --
        // console.log(spc + 'ADDR 0x' + addrHex(position) + ' -- Level:' + level + ' BEGIN' );

        // -- TAG --
        if (scanWebmTag(buffer, position)) {
//            if (data.name == End) {
//                // console.log(spc + 'TAG scan end');
//                break; 
//            }
            //State tagName = tagDictionary[data.name];
            // console.log(spc + 'Tag size=' + result.size + ' Tag=' + result.str + ' <' + tagName + '> TagVal=' + result.value); 
            position += data.size;
        }

        // --- DATA SIZE ---
        if(!scanDataSize(buffer, position))
            break;
//        if (data.name == End) {
//            // console.log(spc + 'DATA SIZE scan end');
//            break; 
//        }
        // console.log(spc + 'DataSize size=' + result.size + ' DataSize str=' + result.str + ' DataSize Val=' + result.value);
        position += data.size;

        // TODO run this in JS and call tag functions
        //var tagFunc = tagFunctions[tagName];
        // ---- DATA ----
        char codec[data.value]; // can't be defined in switch statement?
        uint64_t value;
        double rate;
        switch(data.name) {
            case EBML:
            case Tracks:
            case TrackEntry:
            case Video:
            case Segment:
            case Cluster:
//                if (tagFunc)
//                    tagFunc(result);
                parseWebm(level+1, buffer, position, (position + data.value));
                break;
            case CodecName:
                scanDataUTF8(buffer, position, data.value, codec);
//                if (tagFunc)
//                    tagFunc(codec);
                break;
            case PixelWidth:
            case PixelHeight:
                value = scanDataValueU(buffer, position, data.value);
//                if (tagFunc)
//                    tagFunc(value);
                break;
            case FrameRate:
                rate = scanDataFloat(buffer, position, data.value);
//                if (tagFunc)
//                    tagFunc(rate);
                break;
            case Timecode:
                value = scanDataValueU(buffer, position, data.value);
//                if (tagFunc)
//                    tagFunc(value);
                return position;
            default:
                break;
        }

        if (data.value >= 0) {
            position += data.value;
        }
        else {
            // console.log(spc + 'DATA SIZE ffffffff.. cont.')
        }
        // console.log(' ');

        // -- check EOF ---
        if (position == maxPosition) {
            // console.log(spc + '--level:' + level + ' reached END---');
            break;
        }
        else if (position > maxPosition) {
            // console.log(spc + '--level:' + level + ' --OVER END---' + ' pos=' + position + ' max=' + maxPosition );
            break;
        }
    }

    return position;
}

/* TODO make DFA for byte array to State
function setupTagDictionary() {
    // T - Element Type - The form of data the element contains. m: Master, u: unsigned int, i: signed integer, s: string, 8: UTF-8 string, b: binary, f: float, d: date

    var tagDict = {};
    tagDict['[1A][45][DF][A3]'] = 'EBML'; // EBML 0	[1A][45][DF][A3] m
    tagDict['[42][86]'] = 'EBMLVersion'; //EBMLVersion	1	[42][86] u
    tagDict['[42][F7]'] =  'EBMLReadVersion'; // EBMLReadVersion	1	[42][F7] u
    tagDict['[42][F2]'] =  'EBMLMaxIDLength'; // EBMLMaxIDLength	1	[42][F2] u
    tagDict['[42][F3]'] =  'EBMLMaxSizeLength'; // EBMLMaxSizeLength	1	[42][F3] u
    tagDict['[42][82]'] =  'DocType'; // DocType	1	[42][82] s
    tagDict['[42][87]'] =  'DocTypeVersion'; // DocTypeVersion	1	[42][87] u
    tagDict['[42][85]'] =  'DocTypeReadVersion'; // DocTypeReadVersion	1	[42][85] u
    tagDict['[EC]'] =  'Void'; // Void	g	[EC] b
    tagDict['[BF]'] =  'CRC-32'; // CRC-32	g	[BF] b
    tagDict['[1C][53][BB][6B]'] =  'Cues'; // Cues	1	[1C][53][BB][6B] m
    tagDict['[18][53][80][67]'] = 'Segment';  // Segment	0	[18][53][80][67] m
    tagDict['[11][4D][9B][74]'] = 'SeekHead'; // SeekHead	1	[11][4D][9B][74] m
    tagDict['[4D][BB]'] = 'Seek'; // Seek	2	[4D][BB] m
    tagDict['[53][AB]'] = 'SeekID'; // SeekID	3	[53][AB] b
    tagDict['[53][AC]'] = 'SeekPosition'; // SeekPosition	3	[53][AC] u
    tagDict['[15][49][A9][66]'] = 'Info'; // Info	1	[15][49][A9][66] m 
    tagDict['[16][54][AE][6B]'] = 'Tracks'; // Tracks	1	[16][54][AE][6B] m
    tagDict['[AE]'] = 'TrackEntry'; // TrackEntry	2	[AE] m
    tagDict['[D7]'] = 'TrackNumber'; // TrackNumber	3	[D7] u
    tagDict['[73][C5]'] = 'TrackUID'; // TrackUID	3	[73][C5] u
    tagDict['[83]'] = 'TrackType'; // TrackType	3	[83] u
    tagDict['[23][E3][83]'] = 'DefaultDuration'; // DefaultDuration	3	[23][E3][83] u
    tagDict['[23][31][4F]'] = 'TrackTimecodeScale'; // TrackTimecodeScale	3	[23][31][4F] f
    tagDict['[86]'] = 'CodecID'; // CodecID	3	[86] s
    tagDict['[63][A2]'] = 'CodecPrivate'; // CodecPrivate	3	[63][A2] b
    tagDict['[25][86][88]'] = 'CodecName'; // CodecName	3	[25][86][88] 8
    tagDict['[E0]'] = 'Video'; // Video	3	[E0] m
    tagDict['[B0]'] = 'PixelWidth'; // PixelWidth	4	[B0] u
    tagDict['[BA]'] = 'PixelHeight'; // PixelHeight	4	[BA] u
    tagDict['[23][83][E3]'] = 'FrameRate'; // FrameRate	4	[23][83][E3] f
    tagDict['[E1]'] = 'Audio'; // Audio	3	[E1] m
    tagDict['[B5]'] = 'SamplingFrequency'; // SamplingFrequency	4	[B5] f
    tagDict['[9F]'] = 'Channels'; // Channels	4	[9F] u
    tagDict['[1F][43][B6][75]'] = 'Cluster'; // Cluster	1	[1F][43][B6][75] m
    tagDict['[E7]'] = 'Timecode'; // Timecode	2	[E7] u
    tagDict['[A3]'] = 'SimpleBlock'; // SimpleBlock	2	[A3] b

    return tagDict;
}
*/

static bool scanWebmTag(void* buff, uint64_t pos) {
    size_t tagSize = 0;
    uint8_t firstByte = *((uint8_t*)(buff + pos));
    static const uint8_t firstMask = 0xff;

    if (firstByte & 0x80) {
        tagSize = 1;
    } else if (firstByte & 0x40) {
        tagSize = 2;
    } else if (firstByte & 0x20) {
        tagSize = 3;
    } else if (firstByte & 0x10) {
        tagSize = 4;
    } else {
        //console.log('ERROR: bad TAG byte');
        return false;
    }

    return decodeBytes(buff, pos, tagSize, firstByte, firstMask);
}


static bool scanDataSize(void* buff, uint64_t pos) {
    size_t dataSizeSize = 0;
    uint8_t firstByte = *((uint8_t*)(buff + pos));
    uint8_t firstMask;

    if (firstByte & 0x80) {
        dataSizeSize = 1;
        firstMask = 0x7f;
    } else if (firstByte & 0x40) {
        dataSizeSize = 2;
        firstMask = 0x3f;
    } else if (firstByte & 0x20) {
        dataSizeSize = 3;
        firstMask = 0x1f;
    } else if (firstByte & 0x10) {
        dataSizeSize = 4;
        firstMask = 0x0f;
    } else if (firstByte & 0x08) {
        dataSizeSize = 5;
        firstMask = 0x07;
    } else if (firstByte & 0x04) {
        dataSizeSize = 6;
        firstMask = 0x03;
    } else if (firstByte & 0x02) {
        dataSizeSize = 7;
        firstMask = 0x01;
    } else if (firstByte & 0x01) {
        dataSizeSize = 8;
        firstMask = 0x00;
    } else {
        //console.log('ERROR: bad DATA byte');
        return false;
    }

    return decodeBytes(buff, pos, dataSizeSize, firstByte, firstMask); 
}

static uint64_t scanDataValueU(void* buff, uint64_t pos, size_t size) {
    uint64_t uVal = 0;
    uint8_t byteVal;
    for (size_t i = 0; i < size; i++) {
        byteVal = ((uint8_t*)buff)[pos + i];
        //console.log('scanDataValueU pos=' + pos + ' i=' + i + ' byte=' + byteToHex(byteVal));
        uVal = (uVal << 8) + byteVal;
    }
    return uVal;
}

static void scanDataUTF8(void* buff, uint64_t pos, size_t size, char dest[]) {
    for (size_t i=0; i < size; ++i)
        dest[i] = ((char*)buff)[pos + i];
}

static double scanDataFloat(void* buff, uint64_t pos, size_t size) {
    if (size == sizeof(float)) {
        float f = ((float*)buff)[pos];
        return f;
    } else if (size == sizeof(double)) {
        double df = ((double*)buff)[pos];
        return df;
    } else {
        //console.error('ERROR. Bad Float size=' + size);
        return 0.0;
    }
}

static bool decodeBytes(void* buff, uint64_t pos, size_t size, uint8_t firstByte, uint8_t firstMask) {
    uint8_t value = firstByte & firstMask;
    State currentState = transition(firstByte, initialState);
    for (uint8_t i = 1; i < size; i++) {
        firstByte = ((uint8_t*)buff)[pos + i];
        currentState = transition(firstByte, currentState);
        value = (value << 8) + firstByte;
    }
    if (!finalState(currentState))
        return false;
    data.name = currentState;
    data.size = size;
    data.value = value;
    return true;
}
