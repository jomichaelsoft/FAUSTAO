"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PickRandomArrayItem = PickRandomArrayItem;
/**
 * @param array Where to pick from
 * @returns A random value picked from `array`
 */
function PickRandomArrayItem(array) {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array.at(randomIndex);
}
