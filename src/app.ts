//交差型
type Admin = {
  name: string;
  privileges: string[];
};

type Employee = {
  name: string;
  startDate: Date;
};

type ElevatedEmployee = Admin & Employee;

const e1: ElevatedEmployee = {
  name: "Max",
  privileges: ["create-server"],
  startDate: new Date(),
};

type Combinable = string | number;
type Numeric = number | boolean;

type Universal = Combinable & Numeric;

function add(a: number, b: number): number;
function add(a: string, b: string): string;
function add(a: number, b: string): string;
function add(a: string, b: number): string;
function add(a: Combinable, b: Combinable) {
  if (typeof a === "string" || typeof b === "string") {
    return a.toString() + b.toString();
  }
  return a + b;
}

const result = add("hello", 1);

const fetchedUserDate = {
  id: "u1",
  name: "user1",
  job: {
    title: "Developer",
    description: "TypeScript",
  },
};

console.log(fetchedUserDate?.job?.title);

const userInput = "";

const storedDate = userInput ?? "DEFAULT"; // null と undefined以外
console.log(storedDate);

// type UnknownEmployee = Admin | Employee;

// const printEmployeeInformation = (emp: UnknownEmployee) => {
//   console.log(emp.name);
//   if ("privileges" in emp) {
//     console.log(emp.privileges);
//   }
//   if ("startDate" in emp) {
//     console.log(emp.startDate);
//   }
// };

// console.log(printEmployeeInformation(e1));

// class Car {
//   drive() {
//     console.log("運転中...");
//   }
// }

// class Truck {
//   drive() {
//     console.log("トラックを運転中...");
//   }

//   loadCargo(amount: number) {
//     console.log("荷物を乗せます..." + amount);
//   }
// }

// type Vehrcle = Car | Truck;

// const v1 = new Car();
// const v2 = new Truck();

// function useVehicle(Vehicle: Vehrcle) {
//   Vehicle.drive()

//   if (Vehicle instanceof Truck) {
//     Vehicle.loadCargo(100)
//   }

// }

// interface Bird {
//   type: 'bird',
//   flyingSpeed: number;
// }

// interface Horse {
//   type: 'horse',
//   runningSpeed: number;
// }

// type Animal = Bird | Horse

// function moveAnimal(animal: Animal) {
//   let speed: number;
//   switch(animal.type) {
//     case 'bird':
//       speed = animal.flyingSpeed
//       break;
//     case 'horse':
//       speed = animal.runningSpeed
//       break;
//   }
//   console.log('移動速度：',speed)
// }

// moveAnimal({type:'bird', flyingSpeed:10})

// // const userInputElement = <HTMLInputElement>document.getElementById('user-input');
// const userInputElement = document.getElementById('user-input');

// if(userInputElement){
//   (userInputElement as HTMLInputElement).value = 'こんにちは';
// }

// interface ErrorContainer {
//   // インデックス型により、どんな方のプロパティか？もしくはいくつプロパティが必要が？を解決してくれる。
//   [prop: string]: string;
// }

// const errorBag: ErrorContainer = {
//   email: '正しいメールアドレスではありません'
// };
