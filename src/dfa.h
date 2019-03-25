#include <stdint.h>
#include <stdbool.h>

typedef enum {
    START, AVGBYEVKTG, FQWAFLDNSD, JGLHEALYLQ, EBML, JBUTTRUBVR, EBMLVersion, EBMLReadVersion, EBMLMaxIDLength, EBMLMaxSizeLength, DocType, DocTypeVersion, DocTypeReadVersion, Void, CRC32, IBBTOSKRPU, HDUSYGTCUB, XNRDSYDIQH, Cues, CSIFKYUNSV, NOTSDNABUI, JQWYSNZFQX, Segment, ORFNNSCVBG, MVPJFKEVNP, ADXISXKSTT, SeekHead, ZWYZCWAHQK, Seek, SSNATEMTVF, SeekID, SeekPosition, OXLXCTDRBP, BQAJAHPDJN, DIPZUYMTGV, Info, PKYWAXWDMN, QEUDOBSGRR, FXSPECWTUP, Tracks, TrackEntry, TrackNumber, CXPSROROZV, TrackUID, TrackType, QBRHNGUYCI, EYXIVFEYTQ, DefaultDuration, GINBAWEBZP, TrackTimecodeScale, CodecID, GDKOMORAID, CodecPrivate, HXHJSFEFMB, ZOEVWSASWV, CodecName, Video, PixelWidth, PixelHeight, IYZETQUVTQ, FrameRate, Audio, SamplingFrequency, Channels, TPIHTLNHUS, FZRJRWIKKZ, YRQAWEXZVB, Cluster, Timecode, SimpleBlock
} State;

const State initialState = START;

State transition (uint8_t byte, State state) {
    switch(state) {
        case 0:
            switch(byte) {
                case 66:
                    return 5;
                case 131:
                    return 44;
                case 134:
                    return 50;
                case 77:
                    return 27;
                case 17:
                    return 23;
                case 83:
                    return 29;
                case 21:
                    return 32;
                case 22:
                    return 36;
                case 215:
                    return 41;
                case 24:
                    return 19;
                case 26:
                    return 1;
                case 28:
                    return 15;
                case 159:
                    return 63;
                case 31:
                    return 64;
                case 224:
                    return 56;
                case 225:
                    return 61;
                case 35:
                    return 45;
                case 99:
                    return 51;
                case 163:
                    return 69;
                case 37:
                    return 53;
                case 231:
                    return 68;
                case 236:
                    return 13;
                case 174:
                    return 40;
                case 176:
                    return 57;
                case 115:
                    return 42;
                case 181:
                    return 62;
                case 186:
                    return 58;
                case 191:
                    return 14;
                default:
                    return START;
            }
        case 64:
            switch(byte) {
                case 67:
                    return 65;
                default:
                    return START;
            }
        case 1:
            switch(byte) {
                case 69:
                    return 2;
                default:
                    return START;
            }
        case 65:
            switch(byte) {
                case 182:
                    return 66;
                default:
                    return START;
            }
        case 2:
            switch(byte) {
                case 223:
                    return 3;
                default:
                    return START;
            }
        case 66:
            switch(byte) {
                case 117:
                    return 67;
                default:
                    return START;
            }
        case 3:
            switch(byte) {
                case 163:
                    return 4;
                default:
                    return START;
            }
        case 5:
            switch(byte) {
                case 242:
                    return 8;
                case 130:
                    return 10;
                case 243:
                    return 9;
                case 133:
                    return 12;
                case 134:
                    return 6;
                case 247:
                    return 7;
                case 135:
                    return 11;
                default:
                    return START;
            }
        case 15:
            switch(byte) {
                case 83:
                    return 16;
                default:
                    return START;
            }
        case 16:
            switch(byte) {
                case 187:
                    return 17;
                default:
                    return START;
            }
        case 17:
            switch(byte) {
                case 107:
                    return 18;
                default:
                    return START;
            }
        case 19:
            switch(byte) {
                case 83:
                    return 20;
                default:
                    return START;
            }
        case 20:
            switch(byte) {
                case 128:
                    return 21;
                default:
                    return START;
            }
        case 21:
            switch(byte) {
                case 103:
                    return 22;
                default:
                    return START;
            }
        case 23:
            switch(byte) {
                case 77:
                    return 24;
                default:
                    return START;
            }
        case 24:
            switch(byte) {
                case 155:
                    return 25;
                default:
                    return START;
            }
        case 25:
            switch(byte) {
                case 116:
                    return 26;
                default:
                    return START;
            }
        case 27:
            switch(byte) {
                case 187:
                    return 28;
                default:
                    return START;
            }
        case 29:
            switch(byte) {
                case 171:
                    return 30;
                case 172:
                    return 31;
                default:
                    return START;
            }
        case 32:
            switch(byte) {
                case 73:
                    return 33;
                default:
                    return START;
            }
        case 33:
            switch(byte) {
                case 169:
                    return 34;
                default:
                    return START;
            }
        case 34:
            switch(byte) {
                case 102:
                    return 35;
                default:
                    return START;
            }
        case 36:
            switch(byte) {
                case 84:
                    return 37;
                default:
                    return START;
            }
        case 37:
            switch(byte) {
                case 174:
                    return 38;
                default:
                    return START;
            }
        case 38:
            switch(byte) {
                case 107:
                    return 39;
                default:
                    return START;
            }
        case 42:
            switch(byte) {
                case 197:
                    return 43;
                default:
                    return START;
            }
        case 45:
            switch(byte) {
                case 49:
                    return 48;
                case 227:
                    return 46;
                case 131:
                    return 59;
                default:
                    return START;
            }
        case 46:
            switch(byte) {
                case 131:
                    return 47;
                default:
                    return START;
            }
        case 48:
            switch(byte) {
                case 79:
                    return 49;
                default:
                    return START;
            }
        case 51:
            switch(byte) {
                case 162:
                    return 52;
                default:
                    return START;
            }
        case 53:
            switch(byte) {
                case 134:
                    return 54;
                default:
                    return START;
            }
        case 54:
            switch(byte) {
                case 136:
                    return 55;
                default:
                    return START;
            }
        case 59:
            switch(byte) {
                case 227:
                    return 60;
                default:
                    return START;
            }
    }
}

bool finalState (State state) {
    switch(state) {
        case 67:
        case 4:
        case 68:
        case 69:
        case 6:
        case 7:
        case 8:
        case 9:
        case 10:
        case 11:
        case 12:
        case 13:
        case 14:
        case 18:
        case 22:
        case 26:
        case 28:
        case 30:
        case 31:
        case 35:
        case 39:
        case 40:
        case 41:
        case 43:
        case 44:
        case 47:
        case 49:
        case 50:
        case 52:
        case 55:
        case 56:
        case 57:
        case 58:
        case 60:
        case 61:
        case 62:
        case 63:
            return true;
        default:
            return false;
    }
}

bool exampleStateMachine (uint8_t* buff, size_t size) {
    State currentState = initialState;
    for (int i = 0; i < size; ++i)
        currentState = transition(buff[i], currentState);
    return finalState(currentState);
}

