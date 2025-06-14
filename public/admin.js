
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.role === 'admin') {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('news-form-section').style.display = 'block';
      } else {
        alert('తప్పు లాగిన్ వివరాలు');
      }
    })
    .catch(() => alert('సర్వర్ లోపం'));
}

function addNews() {
  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const imageInput = document.getElementById('imageInput');

  const formData = new FormData();
  formData.append('title', title);
  formData.append('content', content);
  formData.append('image', imageInput.files[0]);

  fetch('/news', {
    method: 'POST',
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert('వార్త జోడించబడింది');
        document.getElementById('title').value = '';
        document.getElementById('content').value = '';
        document.getElementById('imageInput').value = '';
      } else {
        alert('వార్త జోడించడంలో లోపం');
      }
    });
}
