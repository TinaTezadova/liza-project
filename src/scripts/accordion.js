const acc = document.getElementsByClassName("aside__accordion_slide");
let i;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function() {
    this.classList.toggle("aside__accordion_active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight){
      panel.style.maxHeight = null;
    } else {  
      panel.style.maxHeight = panel.scrollHeight + "px";
    } 
  });
}