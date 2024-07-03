import { Draggable } from "../models/drag-drop";
import { Component } from "../components/base-component";
import { Project } from "../models/project";
import { Autobind } from "../decorators/autobind";

// ProjectItem Class
export class ProjectItem
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
