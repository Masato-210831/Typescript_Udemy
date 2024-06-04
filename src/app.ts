const button = document.querySelector("button")!;

function clickHnadler(message: string) {
  console.log('Clicked' + message)
}

if(button) {
  button.addEventListener('click', clickHnadler.bind(null, "You're welcome"))
}


button.addEventListener("click", () => {
  console.log('clicked!')
});
