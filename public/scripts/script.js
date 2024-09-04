document
  .querySelector(".header__search-button")
  .addEventListener("click", () => {
    const searchContainerElmenet = document.querySelector(".searchContainer");
    if (searchContainerElmenet.classList.contains("close")) {
      searchContainerElmenet.classList.remove("close");
      // searchContainerElmenet.classList.add('open')
    }
  });

document.querySelector(".searchClose").addEventListener("click", () => {
  const searchContainerElmenet = document.querySelector(".searchContainer");

  searchContainerElmenet.classList.remove("open");
  searchContainerElmenet.classList.add("close");
});
