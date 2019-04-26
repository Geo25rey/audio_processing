
const FPS = 60;

let time = 0;
let wave = [];
let speed = 0.05;

let slider;
let recorder;

let Audiorun = false;

function onAudioInfo(channel, data, audioInfo) {
    if (channel != 0) // skip anything but first channel
        return;

    if (Audiorun)
        return;
    Audiorun = true;

    // Takes an Float32Array, copies it to the heap and returns a pointer
    function arrayToPtr(array) {
        var ptr = Module._malloc(array.length * 4);
//        Module.HEAP32.set(array.buffer, ptr); // setting 4 bytes at a time
        Module.writeArrayToMemory(array, ptr);
        Module.HEAP32.set([3.2], ptr);
        return ptr;
    }

    // Takes a pointer and  array length, and returns a Float32Array from the heap
    function ptrToArray(ptr, length) {
        var array = new Float32Array(length);
        var pos = ptr / 4; // reading 4 bytes at a time
        array.set(Module.HEAP32.subarray(pos, pos + length));
        return array;
    }

    function dfft(input){
        let n,k;
        let sum;
        let output = [];
        const len = input.length;

        for(n = 0; n < len; n++){
            sum = 0;
            for(k = 0; k < len; k++){
                sum += input[k]*cos((2*PI*k*n)/len);
            }
            output.push(sum/len);
        }
        return output;
    }


    //    console.log("Audio Info:");
    console.log(data);
    //    let ptr = arrayToPtr(data);
    //    Module._dfft(data.length, ptr);
    //    data = ptrToArray(ptr, data.length);
    data = dfft(data);
    console.log(data);
    //    Module._free(ptr);
}


function preload() {
    recorder = new AudioRecorder(onAudioInfo, 
        () => recorder.startRecording());
}

function setup() {
    createCanvas(window.innerWidth, window.innerHeight);
    slider = createSlider(1, 50, 5);
    frameRate(FPS);
}

function draw() {
    let fr = frameRate();
    let spd = 0;//speed * 1.0;
    if (fr >= 1)
        spd = speed * FPS * 1.0 / fr;
    background(0);
    translate(150, 200);

    let x = 0;
    let y = 0;

    for (let i = 0; i < slider.value(); i++) {
        let prevx = x;
        let prevy = y;

        let n = i * 2 + 1;
        let radius = 40 * (4 / (n * PI));
        x += radius * cos(n * time);
        y += radius * sin(n * time);

        stroke(255, 100);
        noFill();
        ellipse(prevx, prevy, radius * 2);

        stroke(255);
        line(prevx, prevy, x, y);
    }
    wave.unshift({x:0, y:y});


    translate(200, 0);
    line(x - 200, y, 0, wave[0]);
    beginShape();
    noFill();
    let speedError = (spd-speed)/speed + 1;
    for (let i = 0; i < wave.length; i++) {
        let v = wave[i];
        vertex(v.x, v.y);
        v.x += speedError;
    }
    endShape();


    time += spd;


    if (wave.length > 250) {
        wave.pop();
    }
}
