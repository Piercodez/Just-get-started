document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('idea-form');
  const submittedFeedback = document.getElementById('submitted-feedback');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const ideaText = document.getElementById('comments').value.trim();
    const userName = document.getElementById('name').value.trim();
    
    if (ideaText && userName) {
      try {
        const response = await fetch('http://localhost:5000/ideas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text: ideaText, user_name: userName }),
        });
        const newIdea = await response.json();
        addIdeaToPage(newIdea);
        form.reset();
      } catch (err) {
        console.error('Error submitting idea:', err);
      }
    }
  });

  submittedFeedback.addEventListener('click', async (event) => {
    if (event.target.classList.contains('upvote-btn')) {
      const ideaElement = event.target.closest('.feedback-item');
      const voteCountSpan = ideaElement.querySelector('.vote-count');
      const ideaId = ideaElement.dataset.id;

      let currentCount = parseInt(voteCountSpan.textContent, 10);
      try {
        if (event.target.classList.contains('blue')) {
          const response = await fetch(`http://localhost:5000/ideas/${ideaId}/downvote`, {
            method: 'PUT',
          });
          const updatedIdea = await response.json();
          currentCount = updatedIdea.votes;
          event.target.classList.remove('blue');
        } else {
          const response = await fetch(`http://localhost:5000/ideas/${ideaId}/upvote`, {
            method: 'PUT',
          });
          const updatedIdea = await response.json();
          currentCount = updatedIdea.votes;
          event.target.classList.add('blue');
        }
        voteCountSpan.textContent = currentCount;
      } catch (err) {
        console.error('Error updating vote:', err);
      }
    }
  });

  function addIdeaToPage(idea) {
    const ideaElement = document.createElement('div');
    ideaElement.className = 'feedback-item';
    ideaElement.dataset.id = idea.id;

    const voteContainer = document.createElement('div');
    voteContainer.className = 'feedback-votes';

    const voteCountSpan = document.createElement('span');
    voteCountSpan.className = 'vote-count';
    voteCountSpan.textContent = idea.votes;

    const upvoteButton = document.createElement('button');
    upvoteButton.innerHTML = '▲';
    upvoteButton.className = 'upvote-btn';

    voteContainer.appendChild(voteCountSpan);
    voteContainer.appendChild(upvoteButton);

    const feedbackContent = document.createElement('div');
    feedbackContent.className = 'feedback-content';

    const ideaParagraph = document.createElement('p');
    ideaParagraph.textContent = idea.text;

    const userNameSpan = document.createElement('span');
    userNameSpan.className = 'user-name';
    userNameSpan.textContent = idea.user_name;

    feedbackContent.appendChild(ideaParagraph);
    feedbackContent.appendChild(userNameSpan);

    ideaElement.appendChild(voteContainer);
    ideaElement.appendChild(feedbackContent);

    submittedFeedback.appendChild(ideaElement);
  }

  async function loadIdeas() {
    try {
      const response = await fetch('http://localhost:5000/ideas');
      const ideas = await response.json();
      ideas.forEach(addIdeaToPage);
    } catch (err) {
      console.error('Error loading ideas:', err);
    }
  }

  loadIdeas();
});
