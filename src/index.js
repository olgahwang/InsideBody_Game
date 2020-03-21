var currentScreen = document.getElementById("onboarding1");
var chosenLevel = 0;

function showFirstPage() {
  currentScreen = document.getElementById("onboarding1");
  currentScreen.style.display = "flex";
  var wrapperDiv = document.getElementById("onboardingWrapper");
  wrapperDiv.style.display = "flex";
}

function showSecondPage() {
  currentScreen.style.display = "none";
  currentScreen = document.getElementById("onboarding2");
  currentScreen.style.display = "flex";
}

function showThirdPage() {
  currentScreen.style.display = "none";
  currentScreen = document.getElementById("onboarding3");
  currentScreen.style.display = "flex";
}

/*function startClicked(){
  var oldBg = document.getElementById("mainMenuDiv");
  oldBg.style.display = "none";
  showFirstPage();
}*/

function pizzaChosen(){
  chosenLevel = 0;
  var oldBg = document.getElementById("mainMenuDiv");
  oldBg.style.display = "none";
  showFirstPage();
}

function saladChosen(){
  chosenLevel = 1;
  var oldBg = document.getElementById("mainMenuDiv");
  oldBg.style.display = "none";
  showFirstPage();
}

function continueToGame(){
  console.log("button clicked");
  if (chosenLevel == 0) {
    window.location.href = './pizza.html';
    console.log("Pizza");
  }
  else {
    if (chosenLevel == 1) {
      window.location.href = './salad.html';
      console.log("Salad");
    }
  }
}
