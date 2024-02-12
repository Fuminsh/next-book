document.addEventListener("DOMContentLoaded", function() {
    fetch("/json/livros.json")
        .then((response) => response.json())
        .then((data) => {
            const livrosSection = document.getElementById("livros");
            const livroSearchInput = document.getElementById("livro-search");

            const shuffleArray = (array) => {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            };

            const sortBooksByRating = () => {
                data.livros.sort((a, b) => b.avaliacao - a.avaliacao);
            };

            const filterAndRenderBestRatedBooks = () => {
                sortBooksByRating();
                renderLivros(data.livros);
            };

            const bemAvaliadosButton = document.getElementById("bem-avaliados-button");
            bemAvaliadosButton.addEventListener("click", filterAndRenderBestRatedBooks);

            const renderLivros = (livros) => {
                livrosSection.innerHTML = "";

                livros.forEach((livro) => {
                    const livroDiv = document.createElement("div");
                    livroDiv.className = "livro";

                    const imagem = document.createElement("img");
                    imagem.src = livro.imagem ? livro.imagem : "https://drive.google.com/uc?id=1jMlHzcHT6MJgFt8eJEF52EN_Ig4tyJcO";
                    imagem.alt = livro.titulo;

                    const titulo = document.createElement("h2");
                    titulo.textContent = livro.titulo;

                    const autor = document.createElement("p");
                    autor.textContent = `de ${livro.autor}`;

                    const edit = document.createElement("p");
                    edit.textContent = `Edição em ${livro.edicao}`;

                    const genre = document.createElement("p");
                    genre.textContent = `Gênero: ${livro.type}`;

                    const preco = document.createElement("p");
                    preco.textContent = livro.preco ? `Preço: ${livro.preco}` : 'Preço não disponível';

                    const avaliacao = document.createElement("span");
                    avaliacao.textContent = `(${livro.avaliacao}) `;
                    avaliacao.className = "avaliacao";
                    const estrelasInteiras = Math.floor(livro.avaliacao);
                    const estrelaParcial = livro.avaliacao - estrelasInteiras;

                    for (let i = 1; i <= 5; i++) {
                        const estrela = document.createElement("span");
                        estrela.className = "estrela";
                        if (i <= estrelasInteiras) {
                            estrela.textContent = "★";
                        } else if (i === estrelasInteiras + 1 && estrelaParcial > 0) {
                            const width = `${estrelaParcial * 100}%`;
                            estrela.innerHTML = `<span style="width: ${width}">★</span>`;
                        } else {
                            estrela.textContent = "☆";
                        }
                        avaliacao.appendChild(estrela);
                    }

                    const buttonsContainer = document.createElement("div");
                    buttonsContainer.className = "buttons-container";

                    if (livro.pdflinkviewer) {
                        const button1 = document.createElement("a");
                        button1.className = "button";
                        button1.textContent = "Abrir";
                        button1.href = livro.pdflinkviewer;
                        button1.target = "_blank";
                        buttonsContainer.appendChild(button1);
                    }

                    if (livro.pdflink) {
                        const button2 = document.createElement("a");
                        button2.className = "button";
                        button2.textContent = "Baixar PDF";
                        button2.href = livro.pdflink;
                        buttonsContainer.appendChild(button2);
                    }


                    livroDiv.appendChild(imagem);
                    livroDiv.appendChild(titulo);
                    livroDiv.appendChild(autor);
                    livroDiv.appendChild(edit);
                    livroDiv.appendChild(genre);
                    livroDiv.appendChild(preco);
                    livroDiv.appendChild(avaliacao);
                    livroDiv.appendChild(buttonsContainer);
                    livrosSection.appendChild(livroDiv);
                });
            };

            const searchBooks = () => {
                const searchQuery = livroSearchInput.value.trim();

                if (searchQuery !== "") {
                    const maxResults = 40;
                    const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(searchQuery)}&maxResults=${maxResults}`;

                    fetch(apiUrl)
                        .then((response) => response.json())
                        .then((data) => {
                            if (data && data.items && data.items.length > 0) {
                                const books = data.items.map((item) => {
                                    const volumeInfo = item.volumeInfo;
                                    const imageLinks = volumeInfo.imageLinks ? volumeInfo.imageLinks.thumbnail : '';
                                    const title = volumeInfo.title || 'Título não disponível';
                                    const authors = volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Autor desconhecido';
                                    const description = volumeInfo.description ? volumeInfo.description.substring(0, 200) + '...' : 'Descrição não disponível';
                                    const genre = volumeInfo.categories ? volumeInfo.categories.join(', ') : 'Gênero não disponível';
                                    const rating = volumeInfo.averageRating || 0;

                                    return {
                                        titulo: title,
                                        autor: authors,
                                        preco: 'Preço não disponível',
                                        imagem: imageLinks,
                                        edicao: 'Idioma não disponível',
                                        type: genre,
                                        avaliacao: rating,
                                        pdflink: item.accessInfo.webReaderLink || '',
                                        pdflinkviewer: item.volumeInfo.infoLink || '',
                                    };
                                });

                                const booksWithRatings = books.filter((book) => book.avaliacao > 0);

                                shuffleArray(booksWithRatings);
                                renderLivros(booksWithRatings);
                            } else {
                                livrosSection.innerHTML = "<p>Nenhum livro encontrado.</p>";
                            }
                        })
                        .catch((error) => {
                            console.error('Erro ao buscar os livros:', error);
                            livrosSection.innerHTML = "<p>Ocorreu um erro ao buscar os livros.</p>";
                        });
                } else {
                    const livros = data.livros;
                    shuffleArray(livros);
                    renderLivros(livros);
                }
            };


            livroSearchInput.addEventListener("input", searchBooks);

            let isGenreFilterMenuOpen = false;

            const showGenreFilterMenu = () => {
                if (isGenreFilterMenuOpen) return;
                isGenreFilterMenuOpen = true;

                const genreFilterMenu = document.getElementById("genre-filter-menu");
                genreFilterMenu.innerHTML = "";

                const genreOptions = [
                    { genre: "all", label: "Todos" },
                    { genre: "Romance", label: "Romances" },
                    { genre: "Literatura Br", label: "Literatura Brasileira" },
                    { genre: "Ficção", label: "Ficção" },
                    { genre: "Distopia", label: "Distopia" }
                ];

                genreOptions.forEach((option) => {
                    const genreOption = document.createElement("a");
                    genreOption.className = "genre-option";
                    genreOption.setAttribute("data-genre", option.genre);
                    genreOption.textContent = option.label;
                    genreFilterMenu.appendChild(genreOption);
                });

                const genreFilterLink = document.getElementById("genre-filter");
                const filterMenuRect = genreFilterLink.getBoundingClientRect();
                genreFilterMenu.style.position = "fixed";
                genreFilterMenu.style.left = filterMenuRect.left + "px";
                genreFilterMenu.style.top = filterMenuRect.bottom + "px";

                genreFilterMenu.style.display = "block";
                genreFilterMenu.classList.add("show");
                fadeIn(genreFilterMenu, 300);
            };

            const hideGenreFilterMenu = () => {
                if (!isGenreFilterMenuOpen) return;
                isGenreFilterMenuOpen = false;

                const genreFilterMenu = document.getElementById("genre-filter-menu");
                genreFilterMenu.classList.remove("show");
                fadeOut(genreFilterMenu, 300);
            };

            const genreFilterLink = document.getElementById("genre-filter");
            genreFilterLink.addEventListener("click", (event) => {
                event.preventDefault();
                if (isGenreFilterMenuOpen) {
                    hideGenreFilterMenu();
                } else {
                    showGenreFilterMenu();
                }
            });

            document.addEventListener("click", (event) => {
                const targetElement = event.target;
                const genreFilterMenu = document.getElementById("genre-filter-menu");
                if (!genreFilterMenu.contains(targetElement) && targetElement !== genreFilterLink) {
                    hideGenreFilterMenu();
                }
            });

            document.getElementById("genre-filter-menu").addEventListener("click", (event) => {
                const targetElement = event.target;
                if (targetElement.classList.contains("genre-option")) {
                    const selectedGenre = targetElement.dataset.genre;
                    const livrosFiltrados = data.livros.filter((livro) =>
                        selectedGenre === "all" ? true : livro.type.includes(selectedGenre)
                    );

                    renderLivros(livrosFiltrados);
                    hideGenreFilterMenu();
                }
            });


            const fadeIn = (element, duration) => {
                let opacity = 0;
                const increment = 1 / (duration / 10);

                element.style.opacity = opacity;
                element.style.display = "block";

                const interval = setInterval(() => {
                    opacity += increment;
                    element.style.opacity = opacity;

                    if (opacity >= 1) {
                        clearInterval(interval);
                    }
                }, 10);
            };

            const fadeOut = (element, duration) => {
                let opacity = 1;
                const decrement = 1 / (duration / 10);

                const interval = setInterval(() => {
                    opacity -= decrement;
                    element.style.opacity = opacity;

                    if (opacity <= 0) {
                        clearInterval(interval);
                        element.style.display = "none";
                    }
                }, 10);
            };
            const livros = data.livros;

            shuffleArray(livros);

            renderLivros(data.livros);
        })
        .catch((error) => {
            console.error('Erro ao carregar os dados:', error);
        });
    
});
