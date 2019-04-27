
const FPS = 60;

let time = 0;
let rawData = [];
let freqData = [];
let speed = 0.05;

let slider;
let recorder;

let Audiorun = false;

let saveAmbiantNoise = true;
let ambiantNoise;

let dataStats = {};
let freqStats = {};

function arrayStats(data, length) {
    let minIndex = 0;
    let maxIndex = 0;
    let sum = 0;
    for (let i = 0; i < length; ++i) {
        let pnt = data[i];
        if (data[minIndex] > pnt) {
            minIndex = int(i);
        }
        if (data[maxIndex] < pnt) {
            maxIndex = int(i);
        }
        sum += pnt;
    }
    return {
        get minIndex() {
            return minIndex;
        },
        get maxIndex() {
            return maxIndex;
        },
        get mean() {
            return sum * 1.0 / length;
        },
    };
}

function onAudioInfo(data, frequencies) {
//    if (Audiorun)
//        return;
//    Audiorun = true;
    rawData = data;
    //console.log("Data:");
    dataStats = arrayStats(data, data.length);
    //for (let key in dataStats)
    //    console.log(key, dataStats[key]);
    freqData = frequencies;
    //console.log("Frequencies:");
    freqStats = arrayStats(frequencies, frequencies.length/2);
    //for (let key in freqStats)
    //    console.log(key, freqStats[key]);

    if (saveAmbiantNoise) {
        saveAmbiantNoise = false;
        ambiantNoise = frequencies;
    }
}


function preload() {
    recorder = new AudioRecorder(onAudioInfo, 
        () => recorder.startRecording());
}

function setup() {
    slider = createSlider(1, 50, 5);
    createCanvas(window.innerWidth * 0.95, window.innerHeight * 0.95 - 50);
    frameRate(FPS);
}

function keyPressed() {
    switch(keyCode) {
        case 87: // 'w'
            saveAmbiantNoise = true;
            break;
        default:
            console.log(keyCode);
            break;
    }
}

let sineWave = new Array(8192);

function draw() {
    let fr = frameRate();
    let spd = 0;//speed * 1.0;
    if (fr >= 1)
        spd = speed * FPS * 1.0 / fr;
    background(0);
    //translate(150, 200);

    let x = 0;
    let y = 0;
/*
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


    line(x - 200, y, 0, wave[0]);*/
    function printWave(wave, xTranslation, yTranslation, xScale, yScale, length, useAmbiantNoise, show) {
        translate(xTranslation, yTranslation);
        stroke(255);
        beginShape();
        noFill();
        let speedError = (spd-speed)/speed + 1;
        for (let i = 0; i < length; i++) {
            //let v = wave[i];
            if (typeof(wave) !== 'function') {
                if (useAmbiantNoise)
                    vertex(i*xScale, yScale*(wave[i] - ambiantNoise[i]));
                else {
                    vertex(i*xScale, yScale*wave[i]);
                    if (show)
                        console.log(yScale * wave[i]);
                }
            } else {
                vertex(i*xScale, yScale*wave(i));
                console.log(wave(i));
                debugger;
            }
            //v.x += speedError;
        }
        endShape();
    }

    printWave(rawData, 
        0, 
        height * 0.2, 
        rawData.length * 1.0 / width, 
        100, 
        rawData.length);
    printWave(freqData, 
        width * 0, 
        height * 0.32, 
        freqData.length * 1.75 / width, 
        -5, 
        freqData.length/2,
        ambiantNoise !== undefined);
    for (let i = 0; i < sineWave.length; ++i)
        sineWave[i] = sin(i*freqStats.maxIndex + time);
    console.log(freqData[freqStats.maxIndex]);
    printWave(sineWave, 
        width * 0, 
        height * 0.3, 
        sineWave.length / width, 
        2.5 * freqData[freqStats.maxIndex], 
        sineWave.length / 8,
        false,
        false);

    time += spd;


/*    if (wave.length > 250) {
        wave.pop();
    }*/
}
