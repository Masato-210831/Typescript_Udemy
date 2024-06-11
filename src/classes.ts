abstract class Department {
  static fiscalYear = 2020;
  // private id: string;
  // name: string;

  // privateにより、employeesはこのクラスからのみアクセスできる
  // accounting.employees[2] = 'anna'のように外部から値を入れられない
  protected employees: string[] = [];

  // staticメソッドによりインスタンス化せずに使用できる
  static createEmployee(name: string) {
    return {name: name}
  }

  constructor(protected readonly id: string, public name: string) {
    // this.name = name;
    // this.id = id
  }

  abstract describe(this: Department): void;

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

  describe(){
    console.log('IT部門 - ID' + this.id)
  }
}


class AccountingDepartment extends Department {
  private lastReport: string;
  private static instance: AccountingDepartment;

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

  private constructor(id: string, private reports: string[]) {
    super(id, 'Accounting');
    this.lastReport = reports[0];
  }

  static getInstance() {
    if (AccountingDepartment.instance) {
      return this.instance
    }
    this.instance = new AccountingDepartment('d2', []);
    return this.instance
  }

  describe() {
    console.log("会計部門 - ID:" + this.id)
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


const employee1 = Department.createEmployee('Max')
// console.log(employee1, Department.fiscalYear)

const it = new ITDepartment("d1", ['Max']);
it.describe()
// it.addEmployee("Max");
// it.addEmployee("Manu");

// it.printEnployeeinformation();
// it.describe();

// console.log(it)

// const accoutingCopy = { describe: accounting.describe}
// const accoutingCopy = {name:'dummy', describe: accounting.describe}
// console.log(accounting);
// accoutingCopy.describe();


// const accounting = new AccountingDepartment('d2', []);
const accounting = AccountingDepartment.getInstance();
const accounting2 = AccountingDepartment.getInstance();

console.log(accounting === accounting2)


// accounting.mostRecentReport = '通期会計レポート';

// accounting.addReport('something')
// accounting.printReports()

// console.log(accounting.mostRecentReport)
// accounting.addEmployee('Max');
// accounting.addEmployee('Manu');
// accounting.printEnployeeinformation()

accounting.describe();