/**
 * @param array Where to pick from
 * @returns A random value picked from `array`
 */
export function PickRandomArrayItem(array: Array<any>): any {
	const randomIndex: number = Math.floor(Math.random() * array.length);
	return array.at(randomIndex);
}
