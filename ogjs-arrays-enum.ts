// const person: {
//   name: string;
//   age: number;
//   hobbies: string[];
//   role: [number, string];
// } = {
//   name: "masa",
//   age: 30,
//   hobbies: ["Sports", "Cooking"],
//   role: [2, "author"],
// };

// const ADMIN = 0;
// const READ_ONLY = 1;
// const AUTHOR = 2;

// enumだと自動的に数値が割り振られる
enum Role {
  ADMIN = 5, 
  READ_ONLY, 
  AUTHOR
}



const person = {
  name: "masa",
  age: 30,
  hobbies: ["Sports", "Cooking"],
  role: Role.ADMIN,
};


// person.role.push('admin');
// person.role[1] = 18 


let favoriteActivities: string[];
favoriteActivities = ["sports"];

console.log(person);

for (const hobby of person.hobbies) {
  console.log(hobby.toUpperCase());
}

if (person.role === Role.ADMIN) {
  console.log('読み取り専用')
}