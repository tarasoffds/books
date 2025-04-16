
function displayBooks({category = null, favoritesOnly = false} = {}) {
  const container = document.getElementById('bookList');
  const searchInput = document.getElementById('searchInput');
  let data = [...books];

  if (favoritesOnly) {
    const favIds = JSON.parse(localStorage.getItem("favorites") || "[]");
    data = data.filter((book, index) => favIds.includes(index));
  } else if (category) {
    data = data.filter(book => parseInt(book["Категория"]) === category);
  }

  function render(list) {
    container.innerHTML = "";
    list.forEach((book, index) => {
      const card = document.createElement("div");
      card.className = "book-card";
      card.innerHTML = `
        <h3>${book["Название"]}</h3>
        <p><strong>Автор:</strong> ${book["Автор"]}</p>
        <p><strong>Страниц:</strong> ${book["Страниц"]}</p>
        <p><strong>Цена:</strong> ${book["Цена"]}</p>
        <p>${book["Описание"]}</p>
        <button onclick="toggleFavorite(${books.indexOf(book)})">
          ${isFavorite(books.indexOf(book)) ? "Убрать из избранного" : "В избранное"}
        </button>
      `;
      container.appendChild(card);
    });
  }

  render(data);

  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase();
      const filtered = data.filter(book =>
        book["Название"].toLowerCase().includes(q) ||
        book["Автор"].toLowerCase().includes(q)
      );
      render(filtered);
    });
  }
}

function toggleFavorite(index) {
  const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  const i = favs.indexOf(index);
  if (i === -1) {
    favs.push(index);
  } else {
    favs.splice(i, 1);
  }
  localStorage.setItem("favorites", JSON.stringify(favs));
  location.reload();
}

function isFavorite(index) {
  const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  return favs.includes(index);
}

function exportFavorites() {
  const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  const favBooks = favs.map(i => books[i]);
  const ws = XLSX.utils.json_to_sheet(favBooks);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Избранное");
  XLSX.writeFile(wb, "favorites.xlsx");
}
