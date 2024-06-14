// // const names: Array<string> = ['Max', 'Manuel']; //sting[]と同じ
// // // names[0].split(' ');

// // const promise: Promise<string> = new Promise((resolve, reject) => {
// //   setTimeout(() => {resolve('終わりました')}, 2000)
// // })

// function merge<T extends object, U extends object>(objA: T, objB: U) { // T, Uは異なったオブジェクトということを提示する->関数を呼び出した時に方が定まる
//   return Object.assign(objA, objB);
// }

// const mergedObject = merge({ name: "Max", hobby:['sports'] }, { age: 20 });
// const mergedObject2 = merge({ name: "Max"}, { age: 20 })
// mergedObject.name;

// interface Lengthy {
//   length:number;
// }

// function countAndDescribe<T extends Lengthy>(element:T):[T, string]{ // lengthプロパティがあればなんでも良い。文字列、Arrayなど
//   let descriptionText = '値がありません。'
//   if(element.length > 0) {
//     descriptionText = `値は${element.length}個です。`
//   }
//   return [element, descriptionText]
// }

// // console.log(countAndDescribe('お疲れ様です。'))
// // console.log(countAndDescribe(['apple', 'orange']))
// console.log(countAndDescribe([]))

// function extractAndCover<T extends object, U extends keyof T>(obj:T, key:U) {
//   return 'Value: ' + obj[key];
// }

// extractAndCover({name:'taro'}, 'name')

// class DataStorage<T extends string | number | boolean> {
//   private data: T[] = []

//   addItem(item: T) {
//     this.data.push(item)
//   }

//   removeItem(item: T) {
//     if(this.data.indexOf(item) === -1){
//       return ;
//     }
//     this.data.splice(this.data.indexOf(item), 1);
//   }

//   getItems() {
//     return [...this.data];
//   }

// }

// const textStorage = new DataStorage<string>();
// textStorage.addItem('data1')
// textStorage.addItem('data2')
// textStorage.removeItem('data1')
// console.log(textStorage.getItems())

// const numberStorage = new DataStorage<number>();

// // const objStorage = new DataStorage<object>();
// // const obj = {name: 'Max'}
// // objStorage.addItem(obj);
// // objStorage.addItem({name:'Manu'});
// // objStorage.removeItem(obj)

// // console.log(objStorage.getItems())



// Utility型ww
interface CourseGoal {
  title: string;
  description: string;
  completeUntil: Date;
}

// function createCourseGoal(
//   title: string,
//   description: string,
//   date: Date
// ): CourseGoal {
//   return {
//     title: title,
//     description: description,
//     completeUntil: date,
//   };
// }
function createCourseGoal(
  title: string,
  description: string,
  date: Date
): CourseGoal {
  let courseGoal: Partial<CourseGoal> = {}
  courseGoal.title = title
  courseGoal.description = description
  courseGoal.completeUntil = date
  return courseGoal as CourseGoal
}


const names: Readonly<string[]> = ['Max', 'Anna']
// names.pop('Manu')

