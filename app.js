var userInput;
var userName;
userInput = 5;
userInput = 'max';
// userName = userInput
function generationError(message, code) {
    throw { message: message, errorCode: code };
}
generationError('エラーが発生しました。', 500);
