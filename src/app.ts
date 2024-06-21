class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLFormElement;
  titleInputElement: HTMLInputElement;
  descriptionInputElemnt: HTMLInputElement;
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
    this.descriptionInputElemnt = this.element.querySelector(
      "#description"
    )! as HTMLInputElement;
    this.mandayInputElement = this.element.querySelector(
      "#manday"
    )! as HTMLInputElement;

    this.configure(); // ボタンのイベント
    this.attach(); // form要素の追加
  }

  private submitHandler(event: Event) {
    event.preventDefault(); // HTTPリクエストが送られないようにする
    console.log(this.titleInputElement.value);
  }

  private configure() {
    // eventlistener関係
    this.element.addEventListener("submit", this.submitHandler.bind(this));
  }

  private attach() {
    // 要素の追加
    this.hostElement.insertAdjacentElement("afterbegin", this.element);
  }
}

const prjInput = new ProjectInput();
