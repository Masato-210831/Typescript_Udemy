// Component Class
// DOMを取得して、表示するベースクラス
// 継承先のhostElementやelementに特化させるためジェネリクスを使用
// ベースクラスなので直接のインスタンス化されないようにabstractに設定する
export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
