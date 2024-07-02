import { Component } from "./base-component.js";
import { DragTarget } from "../models/drag-drop.js";
import { Project, ProjectStatus } from "../models/project.js";
import { Autobind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";
import { ProjectItem } from "./project-item.js";

// ProjectList Class
export class ProjectList
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
