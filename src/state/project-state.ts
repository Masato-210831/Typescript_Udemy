import { Project, ProjectStatus } from "../models/project.js";

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
export class ProjectState extends State<Project> {
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
export const projectState = ProjectState.getInstance();
