let newsData = [];
let currentIndex = 0;

function fetchNews() {
  fetch('/news')
    .then(res => res.json())
    .then(data => {
      newsData = data;
      displayNews();
    });
}

function displayNews() {
  const container = document.getElementById('news');
  container.innerHTML = '';

  if (newsData.length === 0) {
    container.innerHTML = '<p>వార్తలు లేవు</p>';
    return;
  }

  const item = newsData[currentIndex];
  const newsHtml = `
    <div class="news-card">
      <h3 id="news-title">${item.title}</h3>
      <img src="${item.imageUrl}" alt="News Image" id="news-image">
      <p id="news-content">${item.content}</p>
    </div>
  `;

  container.innerHTML = newsHtml;
}

function prevNews() {
  if (currentIndex > 0) {
    currentIndex--;
    displayNews();
  }
}

function nextNews() {
  if (currentIndex < newsData.length - 1) {
    currentIndex++;
    displayNews();
  }
}

// Share functionality
document.getElementById("share-button").addEventListener("click", () => {
  const titleEl = document.getElementById('news-title');
  const contentEl = document.getElementById('news-content');

  if (!titleEl || !contentEl) {
    alert("News not loaded yet.");
    return;
  }

  const shareData = {
    title: 'దేశ వాణి',
    text: `${titleEl.textContent}\n\n${contentEl.textContent}`,
    url: window.location.href
  };

  if (navigator.share) {
    navigator.share(shareData).catch(console.error);
  } else {
    alert("Sharing not supported in this browser.");
  }
});

fetchNews();
