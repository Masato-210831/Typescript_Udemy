class Department {
  // private id: string;
  // name: string;

  // privateにより、employeesはこのクラスからのみアクセスできる
  // accounting.employees[2] = 'anna'のように外部から値を入れられない
  protected employees: string[] = [];

  constructor(private readonly id: string, public name: string) {
    // this.name = name;
    // this.id = id
  }

  describe(this: Department) {
    console.log(`Department (${this.id}): ${this.name}`);
  }

  addEmployee(employee: string) {
    this.employees.push(employee);
  }

  printEnployeeinformation() {
    console.log(this.employees.length);
    console.log(this.employees);
  }
}

class ITDepartment extends Department {
  admins:string[]
  constructor(id: string, admins: string[]) {
    super(id, 'IT');
    this.admins = admins
  }
}


class AccountingDepartment extends Department {
  private lastReport: string;

  get mostRecentReport() {
    if (this.lastReport) {
      return this.lastReport;
    }
    throw new Error('レポートが見つかりません。')
  }

  set mostRecentReport(value: string){
    if (!value) {
      throw new Error('正しい値を設定してください。')
    }
    this.addReport(value)
  }

  constructor(id: string, private reports: string[]) {
    super(id, 'Accounting');
    this.lastReport = reports[0];
  }

  addReport(text:string){
    this.reports.push(text)
    this.lastReport = text;
  }

  printReports(){
    console.log(this.reports);
  }

  addEmployee(name: string){
    if (name === 'Max'){
      return;
    } else {
     this.employees.push(name) 
    }
  }
}

const it = new ITDepartment("d1", ['Max']);
it.addEmployee("Max");
it.addEmployee("Manu");

it.printEnployeeinformation();
it.describe();

console.log(it)

// const accoutingCopy = { describe: accounting.describe}
// const accoutingCopy = {name:'dummy', describe: accounting.describe}
// console.log(accounting);
// accoutingCopy.describe();


const accounting = new AccountingDepartment('d2', []);

accounting.mostRecentReport = '通期会計レポート';

accounting.addReport('something')
accounting.printReports()

console.log(accounting.mostRecentReport)
accounting.addEmployee('Max');
accounting.addEmployee('Manu');
accounting.printEnployeeinformation()
