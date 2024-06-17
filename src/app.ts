function Logger(logString: string) {
  console.log("LOGGER ファクトリ");
  return function (constructor: Function) {
    console.log(logString);
    console.log(constructor);
  };
}

function WithTemplate(template: string, hookId: string) {
  console.log("TEMPATE ファクトリ");
  return function<T extends {new(...args: any[]): {name:string}}> (originalConstructor: T) {
    return class extends originalConstructor {
      constructor(..._: any[]) {
        super();
        console.log("テンプレートを表示");
        const hookEl = document.getElementById(hookId);
        if (hookEl) {
          hookEl.innerHTML = template;
          hookEl.querySelector("h1")!.textContent = this.name;
        }
      }
    };
  };
}

// @Logger("ログ出力中 - PERSON")
@Logger("ログ出力中")
@WithTemplate("<h1>Personオブジェクト</h1>", "app")
class Person {
  name = "Max";

  constructor() {
    console.log("Personオブジェクトを作成中・・・");
  }
}

const pers = new Person();
console.log(pers);

// ---------

function Log(target: any, propertyName: string | Symbol) {
  console.log("Property デコレータ");
  console.log(target, propertyName);
}

function Log2(target: any, name: string, descriptor: PropertyDescriptor) {
  console.log("Accessor デコレータ");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log3(
  target: any,
  name: string | Symbol,
  descriptor: PropertyDescriptor
) {
  console.log("Method デコレータ");
  console.log(target);
  console.log(name);
  console.log(descriptor);
}

function Log4(target: any, name: string | Symbol, position: number) {
  console.log("Parameter デコレータ");
  console.log(target);
  console.log(name);
  console.log(position);
}

class Product {
  @Log
  title: string;
  private _price: number;

  @Log2
  set price(val: number) {
    if (val > 0) {
      this._price = val;
    } else {
      throw new Error("不正な価格です - 0 以下は設定できません。");
    }
  }

  constructor(t: string, p: number) {
    this.title = t;
    this._price = p;
  }

  @Log3
  getPriceWithTax(@Log4 tax: number) {
    return this._price * (1 + tax);
  }
}


function Autobind(_:any, _2: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const booundFn = originalMethod.bind(this);
      return booundFn;
    } 
  }
  return adjDescriptor;
}


class Printer {
  message = 'クリックしました。'

  @Autobind
  showMessage() {
    console.log(this.message);
  }
}

const p = new Printer();

const button = document.querySelector('button')!;
button.addEventListener('click', p.showMessage);

// ------------------------------------------------


interface ValidatorConfig {
  [prop: string]:{
    [validatableProp:string]: string[] // ['title', 'positive']
  }
}

const registeredValidators: ValidatorConfig = {}; 

function Required(target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: ['required'],
  }
}

function PositiveNumber (target: any, propName: string) {
  registeredValidators[target.constructor.name] = {
    ...registeredValidators[target.constructor.name],
    [propName]: ['positive'],
  }
}


function validate(obj: any){
  const objvalidatiorConfig = registeredValidators[obj.constructor.name]

  if (!objvalidatiorConfig) {
    return true;
  }

  let isValid = true;
  for (const prop in objvalidatiorConfig) {
    console.log(prop);
    for (const validator of objvalidatiorConfig[prop]){
      switch (validator) {
        case 'required':
          isValid = isValid && !!obj[prop];
          break
        case 'positive':
          isValid = isValid && obj[prop] > 0;
          break
      }
    }
  }
  return isValid;
}


class Course {
  @Required
  title: string;
  @PositiveNumber
  price: number;

  constructor(t:string, p:number) {
    this.title = t;
    this.price = p;
  }
}

const corseForm = document.querySelector('form')!;
corseForm.addEventListener('submit', event => {
  event.preventDefault();
  const titleEl = document.getElementById('title') as HTMLInputElement;
  const priceEl = document.getElementById('price') as HTMLInputElement;

  const title = titleEl.value;
  const price = +priceEl.value;

  const createdCourse = new Course(title, price)

  if (!validate(createdCourse)) {
    alert('正しく入力してください。')
    return;
  }
  console.log(createdCourse)
})

