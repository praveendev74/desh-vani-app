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
document.getElementById("share-button").addEventListener("click", async () => {
  try {
    const response = await fetch(newsData.imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'desh-vani-image.png', { type: blob.type });

    const shareData = {
      title: newsData.title,
      text: newsData.content,
      url: window.location.href,
      files: [file]
    };

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share(shareData);
    } else {
      alert("Image sharing is not supported on this browser.");
    }
  } catch (error) {
    console.error("Error while sharing:", error);
    alert("Failed to share news.");
  }
});

fetchNews();
