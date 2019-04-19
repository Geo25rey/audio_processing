// Fourier Series
// Daniel Shiffman
// https://thecodingtrain.com/CodingChallenges/125-fourier-series.html
// https://youtu.be/Mm2eYfj0SgA

const FPS = 60;

let time = 0;
let wave = [];
let path = [];
let speed = 0.05;

let slider;
let recorder;
let webmDecoder;

function onAudioInfo(data) {
	// recorder.getAudioElement().play();
	let buff = util.atobarr(data);
	webmDecoder.decode(buff);
}


let webmTagFunctions = {};
let recordTime = 20; //milliseconds

function preload() {
	recorder = new AudioRecorder(onAudioInfo, 
				() => recorder.startRecording(recordTime));
	webmDecoder = new WebmDecoder(webmTagFunctions);
	console.log(webmTagFunctions);
	// recordLoop();
}

function setup() {
	createCanvas(600, 400);
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
