// const add = (a: number = 1, b:number) => a + b;

// const printOutput: (output: string | number) => void =  output => {
//   console.log(output)
// }

// printOutput(add(b = 2))

const hobbies = ["Sports", "Cooking"];
const activeHobbies = ["Hiking"];

const person = {
  firstName:'Max',
  age: 30,
};

activeHobbies.push(...hobbies);

const add = (...numbers: number[]) => {
 return numbers.reduce((curResult, curValue) => {
    return curResult + curValue
  }, 0)
};

const addedNumbers = add(5, 10, 2, 3.7);
console.log(addedNumbers);


const [hobby1, hobby2, ...remainingHobbies] = hobbies;

const {firstName, age} = person;