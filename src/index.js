var currentScreen = document.getElementById("onboarding1");

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
  var wrapperDiv = document.getElementById("onboardingWrapper");
  wrapperDiv.style.display = "flex";
}

function startClicked(){
  var oldBg = document.getElementById("mainMenuDiv");
  oldBg.style.display = "none";
  showFirstPage();
}
