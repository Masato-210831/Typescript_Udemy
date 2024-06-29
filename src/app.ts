// ドラック&ドロップ
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent): void;
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

// Project Type
// 数値で紐付けさせたいのでstatusはenum型で定義
enum ProjectStatus {
  Active,
  Finished,
}

// 雛形の作成
class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public manday: number,
    public status: ProjectStatus
  ) {}
}

// Project State Management
type Listener<T> = (item: T[]) => void;

class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

// Project State Management
// プロジェクトリストの状態管理
class ProjectState extends State<Project> {
  // グローバルに管理するため、コンストラクタで初期化しない？？
  private projects: Project[] = [];
  // グローバルにするためstatic
  private static instance: ProjectState;

  // シングルトンインスタンス
  // インスタンスを生成するので空でもconstructorが必要？？？
  private constructor() {
    super();
  }

  // シングルトンに必要なメソッドで、これによりグローバルにアクセスできるようになる。
  // グローバルにするためstatic
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }
    this.instance = new ProjectState();
    return this.instance;
  }

  // リストにinputされたプロジェクトをpushする
  addProject(title: string, description: string, manday: number) {
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      manday,
      ProjectStatus.Active
    );

    this.projects.push(newProject);
    this.updateListeners();
  }

  // projectIdからproject.statusを変更するメソッド
  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId); // 対象projectを取得

    // 異なるProjectListにdropした場合のみ、再描画する。
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  // 複数のメソッドで下記のforループを使用するのでprivateメソッド化
  private updateListeners() {
    for (const listerfunc of this.listeners) {
      // オリジナルのリストは渡さず、コピーを渡す
      // オリジナルを渡すとオリジナル配列が外から変更可能になる
      listerfunc([...this.projects]);
    }
  }
}

// シングルトンインスタンスの生成
const projectState = ProjectState.getInstance();

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

// Component Class
// DOMを取得して、表示するベースクラス
// 継承先のhostElementやelementに特化させるためジェネリクスを使用
// ベースクラスなので直接のインスタンス化されないようにabstractに設定する
abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
  ) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T; // document.get・・を取得後、Tにキャスト
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );

    this.element = importedNode.firstElementChild! as U;
    if (newElementId) {
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  // オーバーライド強制
  abstract configure(): void;
  abstract renderContent(): void;

  // コンストラクタと同じ引数名は避ける
  private attach(insertAtBeginning: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? "afterbegin" : "beforeend",
      this.element
    );
  }
}

// ProjectItem Class
class ProjectItem
  extends Component<HTMLUListElement, HTMLLinkElement>
  implements Draggable
{
  private project: Project;

  // this.project.mandayに加工を加えたmandayプロパティの作成
  get manday() {
    if (this.project.manday < 20) {
      return this.project.manday.toString() + "人日";
    } else {
      return (this.project.manday / 20).toString() + "人月";
    }
  }

  constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragStartHandler(event: DragEvent) {
    // dragイベントにおける保管するデータの設定
    event.dataTransfer!.setData("text/plain", this.project.id);
    event.dataTransfer!.effectAllowed = "move"; // カーソルの表示関係(dragする意図をブラウザに伝える？？)
  }

  dragEndHandler(_: DragEvent) {
    console.log("Drag終了");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector("h3")!.textContent = this.manday;
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}

// ProjectList Class
class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assigneProjects: Project[];

  constructor(private type: "active" | "finished") {
    // superの呼び出しが完了するまでthis.は呼び出せない
    super("project-list", "app", false, `${type}-projects`);
    this.assigneProjects = [];

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragOverHandler(event: DragEvent) {
    // dataTransferが保管させている + fromdataがtest/plainの時のみ処理をする
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      event.preventDefault(); // dropの許可をする --> defaultでは許可しない --> dropHandlerが呼ばれない
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @Autobind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer!.getData("text/plain");
    projectState.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @Autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("drop", this.dropHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);

    // ProjectStateのシングルトンより
    // projectState.addProject()が実行されるとこのaddListenerに追加される関数も実行される
    projectState.addListener((projects: Project[]) => {
      const relevantProjects = projects.filter((project) => {
        // statusがactiveの分岐
        if (this.type === "active") {
          return project.status === ProjectStatus.Active;
        }
        1;
        // statusがfinishedの分岐
        return project.status === ProjectStatus.Finished;
      });
      // 追加されたProjectsで上書き
      this.assigneProjects = relevantProjects;
      this.renderProject();
    });
  }

  // ベースクラスではabstractに指定いているため、private設定できない
  renderContent() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector("h2")!.textContent =
      this.type === "active" ? "実行中プロジェクト" : "完了プロジェクト";
  }

  private renderProject() {
    const listEl = document.getElementById(
      `${this.type}-project-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const project of this.assigneProjects) {
      new ProjectItem(listEl.id, project);
    }
  }
}

// ProjectInput Class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  mandayInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");

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
  }

  configure() {
    // eventlistener関係
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}

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
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, mandy] = userInput;
      projectState.addProject(title, desc, mandy);
      this.clearInputs();
    }
  }
}

const prjInput = new ProjectInput();
const activeProject = new ProjectList("active");
const finishedProject = new ProjectList("finished");
