let userInput : unknown;
let userName : string;

userInput = 5;
userInput = 'max'

// userName = userInput


function generationError (message: string, code: number): never {
  throw { message: message, errorCode : code }
}


generationError('エラーが発生しました。', 500);