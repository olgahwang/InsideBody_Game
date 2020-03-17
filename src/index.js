
function plusDivs(n) {
  showDivs(slideIndex += n);
}

function showDivs(n) {
  var i;
  var x = document.getElementsByClassName("onboarding");
  if (n > x.length) {slideIndex = 1}
  if (n < 1) {slideIndex = x.length} ;
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex-1].style.display = "flex";
}

function startClicked(){
  //var slideIndex = 1;
  //showDivs(slideIndex);
  var oldBg = document.getElementById("mainMenuDiv");
  console.log(oldBg);
  oldBg.style.display = "none";
}
