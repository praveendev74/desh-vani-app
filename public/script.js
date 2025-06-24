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

document.getElementById("share-button").addEventListener("click", async () => {
  const title = newsData.title;
  const content = newsData.content;
  const url = window.location.href;

  const shareText = `${title}\n\n${content}`;

  try {
    if (navigator.share) {
      await navigator.share({
        title,
        text: shareText,
        url
      });
    } else {
      alert("Sharing not supported on this device.");
    }
  } catch (err) {
    console.error("Sharing failed:", err);
    alert("Sharing failed or not supported.");
  }
});



fetchNews();
