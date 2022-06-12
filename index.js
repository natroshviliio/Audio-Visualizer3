const canvas = document.createElement('canvas');
canvas.width = window.innerWidth;
canvas.height = window.innerWidth;
document.body.insertAdjacentElement('afterbegin', canvas);

const ctx = canvas.getContext('2d');

const image = new Image();
image.src = './evildevil.png';

const audio = document.createElement('audio');
const audioSource = document.createElement('source');
audio.append(audioSource);
document.body.insertAdjacentElement('afterbegin', audio);
audioSource.src = './Vini_Vici_Astrix_-_Adhana_Clip_Ed_(getmp3.pro).mp3';

audio.currentTime = 25;

window.addEventListener('keydown', (e) => {
	e.key === ' ' && audio.paused ? audio.play() : audio.pause();
});

const audioContext = new AudioContext();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);

source.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 512;
analyser.minDecibels = -100;
analyser.maxDecibels = -10;
analyser.smoothingTimeConstant = 0.72;

const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const bimg = document.getElementById('bimg');

let c = 0;
let globalVar = 0;
let globalVar2 = 0;
let deploySquare = true;
let bimW = getPropValue(bimg, 'width');
let bimH = getPropValue(bimg, 'height');
let coe = 0;
const coep = document.getElementById('coe');
coep.onclick = () => coep.remove();
function createVisualizer() {
	audioContext.resume();
	if (!audio.paused) {
		analyser.getByteFrequencyData(dataArray);
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		const arrayMax = Math.max(...dataArray);
		const imageSize = arrayMax / 1.4;

		for (let i = 0; i < bufferLength; i++) {
			const eachByte = dataArray[i];
			const circleSize = eachByte / 3.9;
			const circlePositionX = canvas.width / 2;
			const circlePositionY = canvas.height / 2;

			const g = eachByte * 1.3;
			globalVar = arrayMax;
			globalVar2 = eachByte;

			ctx.globalAlpha = 1 /* eachByte * (1 / arrayMax) + 0.1 */;

			const SinusX = Math.sin((i * (Math.cos((coe * Math.PI) / 120) * coe) * Math.PI) / 45) * 2.4;
			const CosinusY = Math.cos((i * (Math.cos((coe * Math.PI) / 120) * coe) * Math.PI) / 45) * 2.4;

			//sinus-cosinus
			ctx.beginPath();
			ctx.fillStyle = `rgb(${0}, ${0}, ${0})`;
			ctx.shadowColor = `rgb(${globalVar / 2}, ${0}, ${0})`;
			ctx.shadowBlur = 1;
			ctx.arc(circlePositionX + i * SinusX, circlePositionY + i * CosinusY, circleSize, 0, 2 * Math.PI);
			ctx.fill();

			ctx.beginPath();
			ctx.fillStyle = `rgb(${255}, ${255}, ${255})`;
			ctx.shadowColor = `rgb(${globalVar / 3}, ${0}, ${0})`;
			ctx.shadowBlur = 1;
			ctx.arc(circlePositionX - i * SinusX, circlePositionY - i * CosinusY, circleSize, 0, 2 * Math.PI);
			ctx.fill();

			ctx.globalAlpha = Math.abs(Math.cos((i * Math.PI) / 180) * (arrayMax / 1 / 255)) * 0;
			canvas.style.transform = `rotate(${c}deg)`;
			// if (arrayMax > 195) c += 0.05;
			// else c -= 0.02;
			if (c >= 360) c = 0;
			coe += 1 / 6000;

			coep.innerHTML = coe;
		}
		ctx.shadowColor = `rgb(${arrayMax / (1 / arrayMax)}, 0, 0)`;
		ctx.shadowBlur = 4;
		ctx.drawImage(
			image,
			canvas.width / 2 - imageSize / 2,
			canvas.height / 2 - imageSize / 2,
			imageSize,
			imageSize,
		);

		bimW += 0.3;
		bimH += 0.3;
		bimg.style.width = `${bimW + arrayMax * 2}px`;
		bimg.style.height = `${bimH + arrayMax * 2}px`;
		bimg.style.filter = `brightness(${arrayMax * (0.5 / 255)})`;
		if (deploySquare) {
			//goIn();
		}
	}
	requestAnimationFrame(createVisualizer);
}

function getPropValue(elem, prop) {
	return parseFloat(window.getComputedStyle(elem).getPropertyValue(prop));
}

function goIn() {
	deploySquare = false;
	let o = 1;
	let w = 0;
	let t = 0;
	let l = 0;

	const square = document.createElement('div');
	const randX = (Math.random() - 0.5) * 5;
	const randY = (Math.random() - 0.5) * 5;
	square.classList.add('square');
	document.body.insertAdjacentElement('afterbegin', square);
	const anim = setInterval(() => {
		const sqWidth = getPropValue(square, 'width');
		const sqHeight = getPropValue(square, 'height');
		const sqTop = getPropValue(square, 'top');
		const sqLeft = getPropValue(square, 'left');
		w += 0.04;
		o -= 0.06;
		t += randX;
		l += randY;

		square.style.width = `${sqWidth + w}px`;
		square.style.height = `${sqHeight + w}px`;
		square.style.left = `${sqLeft + l}px`;
		square.style.top = `${sqTop + t}px`;
		square.style.backgroundColor = `rgb(${globalVar}, 0, 0)`;

		square.style.opacity = o;

		if (o < 0.6 && o > 0.5) {
			deploySquare = true;
		}
		if (o <= 0) {
			clearInterval(anim);
			square.remove();
		}
	}, 1000 / 25);
}

createVisualizer();
