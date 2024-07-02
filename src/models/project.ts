// Project Type
// 数値で紐付けさせたいのでstatusはenum型で定義
export enum ProjectStatus {
  Active,
  Finished,
}

// 雛形の作成
export class Project {
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public manday: number,
    public status: ProjectStatus
  ) {}
}
