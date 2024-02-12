document.addEventListener("DOMContentLoaded", function() {
    const searchContainer = document.querySelector(".search-container");
    const searchBar = document.getElementById("livro-search");
    const initialSearchContainerTop = searchContainer.getBoundingClientRect().top;
    const updateSearchContainerPosition = () => {
        const scrollY = window.scrollY || window.pageYOffset;
        const scrollThreshold = 10;

        if (scrollY >= initialSearchContainerTop - scrollThreshold) {
            searchContainer.classList.add("sticky-search-container");
            searchBar.setAttribute("id", "sticky-livro-search");
        } else {
            searchContainer.classList.remove("sticky-search-container");
            searchBar.setAttribute("id", "livro-search");
        }
    };
    window.addEventListener("load", updateSearchContainerPosition);
    window.addEventListener("scroll", updateSearchContainerPosition);
});