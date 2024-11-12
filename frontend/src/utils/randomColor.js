const char = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'A', 'B', 'C', 'D', 'E', 'F'];

function randomIndex(array) {
	return Math.floor(Math.random() * array.length);
}

function randomColor() {
	let finalColor = '#';

	for (let i = 0; i < 6; i++) {
		finalColor += char[randomIndex(char)];
	}

	return finalColor.toString();
}

export default randomColor;
