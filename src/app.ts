// Project State Management
// プロジェクトリストの状態管理
class ProjectState {
  private listeners: any[] = [];
  // グローバルに管理するため、コンストラクタで初期化しない？？
  private projects: any[] = [];
  // グローバルにするためstatic
  private static instance: ProjectState;

  // シングルトンインスタンス
  // インスタンスを生成するので空でもconstructorが必要？？？
  private constructor() {

  }

  // シングルトンに必要なメソッドで、これによりグローバルにアクセスできるようになる。
  // グローバルにするためstatic
  static getInstance() {
    if(this.instance) {
      return this.instance
    }
    this.instance = new ProjectState();
    return this.instance
  }

  addListener(listenerFn: Function) {
    this.listeners.push(listenerFn)
  }
  
  // リストにinputされたプロジェクトをpushする
  addProject(title: string, description: string, manday: number) {
    const newProject = {
      id: Math.random().toString(), // 被る可能性がある-> reactならcount状態管理で行けるのに
      title:title,
      description: description,
      manday: manday
    }

    this.projects.push(newProject);
    for (const listerfunc of this.listeners) {

      // オリジナルのリストは渡さず、コピーを渡す
      // オリジナルを渡すとオリジナル配列が外から変更可能になる
      listerfunc([...this.projects])
    }
  }
}

// シングルトンインスタンスの生成
const projectState = ProjectState.getInstance()



// Validation
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}


function validate(validatableInput: Validatable) {
  let isValid = true;
  if (validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().length !== 0;
  }
  if (
    validatableInput.minLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length >= validatableInput.minLength;
  }

  if (
    validatableInput.maxLength != null &&
    typeof validatableInput.value === "string"
  ) {
    isValid =
      isValid && validatableInput.value.length <= validatableInput.maxLength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value >= validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isValid = isValid && validatableInput.value <= validatableInput.max;
  }

  return isValid;
}

// bind(this)のためのデコレータ
function Autobind(_: any, _2: string, descriptior: PropertyDescriptor) {
  const originalMethod = descriptior.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,
    get() {
      const newFn = originalMethod.bind(this);
      return newFn;
    },
  };
  return adjDescriptor;
}

// ProjectList Class

class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assigneProjects: any[];

  constructor(private type: 'active' | 'finished') {
    this.templateElement = document.getElementById("project-list")! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;
    const importedNode = document.importNode(this.templateElement.content, true)
    this.element = importedNode.firstElementChild! as HTMLElement;
    this.element.id = `${this.type}-projects`
    this.assigneProjects = [];

    // ProjectStateのシングルトンより
    // projectState.addProject()が実行されるとこのaddListenerに追加される関数も実行される
    projectState.addListener((projects: any[]) => {
      // 追加されたProjectsで上書き
      this.assigneProjects = projects;
      this.renderProject();
    })


    this.attach();
    this.renderContent();
  }

  private renderProject() {
    const listEl = document.getElementById(`${this.type}-project-list`)! as HTMLUListElement;
    for (const project of this.assigneProjects) {
      const listItem = document.createElement('li')
      listItem.textContent = project.title;
      listEl.append(listItem)
    }
  }


  private renderContent() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('h2')!.textContent = this.type === 'active' ? '実行中プロジェクト' : '完了プロジェクト';


  }

  private attach() {
    this.hostElement.insertAdjacentElement("beforeend", this.element)
  }

}





// ProjectInput Class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  mandayInputElement: HTMLInputElement;

  constructor() {
    // コンストラクタでは主に要素の参照を取得
    this.templateElement = document.getElementById(
      "project-input"
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById("app")! as HTMLDivElement;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    
    this.element = importedNode.firstElementChild! as HTMLFormElement;
    this.element.id = "user-input";
    this.titleInputElement = this.element.querySelector(
      "#title"
    )! as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.mandayInputElement = this.element.querySelector(
      "#manday"
    )! as HTMLInputElement;

    this.configure(); // ボタンのイベント
    this.attach(); // form要素の追加
  }

  //フォームのタイトル・名前・人日の値を取得し、検証後に返す
  // 検証：空、
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredMonday = this.mandayInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true,
    };
    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };
    const mandaynValidatable: Validatable = {
      value: enteredMonday,
      required: true,
      min: 1,
      max: 1000,
    };

    if (
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(mandaynValidatable)
    ) {
      alert("入力値が正しくありません。再度お試しください。");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredMonday];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.mandayInputElement.value = "";
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault(); // HTTPリクエストが送られないようにする
    console.log(this.titleInputElement.value);
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, mandy] = userInput;
      projectState.addProject(title, desc, mandy)
      console.log(title, desc, mandy);
      this.clearInputs();
    }
  }

  private configure() {
    // eventlistener関係
    this.element.addEventListener("submit", this.submitHandler);
  }

  private attach() {
    // 要素の追加
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
const activeProject = new ProjectList('active');
const finishedProject = new ProjectList('finished');

const b = [1, 2, 3, 4]
const a = [1, 2, 3]

