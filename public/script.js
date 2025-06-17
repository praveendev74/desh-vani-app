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
    const title = newsData.title;
    const content = newsData.content;
    const imageUrl = window.location.origin + newsData.imageUrl; // Absolute path
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const file = new File([blob], 'news-image.png', { type: blob.type });

    const shareData = {
      title,
      text: `${title}\n\n${content}`,
      url: window.location.href,
      files: [file],
    };

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share(shareData);
    } else {
      // Fallback: Share without image
      await navigator.share({
        title,
        text: `${title}\n\n${content}`,
        url: window.location.href
      });
    }
  } catch (err) {
    console.error("Sharing failed:", err);
    alert("Sharing failed or not supported on this device.");
  }
});


fetchNews();
