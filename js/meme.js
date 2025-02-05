document.addEventListener('DOMContentLoaded', () => {
    // Przykładowy sposób pobierania danych z lokalnego pliku JSON (np. memes.json)
    fetch('data/memes.json')
      .then(response => response.json())
      .then(memes => {
        const gallery = document.querySelector('.meme-gallery');
        memes.forEach(meme => {
          const article = document.createElement('article');
          article.className = 'meme';
          article.innerHTML = `
            <img src="${meme.img}" alt="${meme.alt}">
            <p>${meme.description}</p>
          `;
          gallery.appendChild(article);
        });
      })
      .catch(error => console.error('Błąd przy pobieraniu memów:', error));
  });
  