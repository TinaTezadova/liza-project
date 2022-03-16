const accordionItems = document.querySelectorAll(".aside__accordion_slide");
const defaultActiveBlocks = document.querySelectorAll('.aside__accordion_active');

const openPanelBlock = (panel) => {
  if (panel.style.maxHeight){
    panel.style.maxHeight = null;
  } else {
    panel.style.maxHeight = `${panel.scrollHeight}px`;
  }
  panel.classList.toggle('aside__panel_visible')
};

const handleAccordionClick = (event) => {
  const panel = event.target.nextElementSibling;
  event.target.classList.toggle("aside__accordion_active");
  openPanelBlock(panel);
}

accordionItems.forEach((item) => {
  item.addEventListener('click', handleAccordionClick)
});

defaultActiveBlocks.forEach((item) => {
  const panel = item.nextElementSibling;
  openPanelBlock(panel)
});