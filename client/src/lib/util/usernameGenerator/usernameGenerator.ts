import { adjectives } from "./adjective";
import { animals } from "./animal";


/**
 * animals.length: 97
 * adjectives.length: 140
 * 3 digit base 10: 10^3
 * @returns
 * a suitably unique username to the order of 97 * 140 * 10^3 = ~13.5 million unique usernames at any given time
 */
export const generateUserName = () => {
	const animal = animals[Math.floor(Math.random() * animals.length)]; //random animal
	const adjective = adjectives[Math.floor(Math.random() * adjectives.length)]; //random adjective
	const number = Math.floor(Math.random() * 999).toString(); //random 3 digit number

	return adjective + animal + number;
};