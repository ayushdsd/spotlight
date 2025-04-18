import axios from 'axios';
import { API_BASE_URL } from '../utils/api';

const DUMMY_POSTS = [
  {
    content: "🎬 Welcome to Spotlight! This is a sample post from the team.",
  },
  {
    content: "🚀 Artists and recruiters can now share updates on the feed! Try posting something new.",
  },
  {
    content: "🌟 Did you know? You can view and manage all your posts from your profile page.",
  },
];

async function seedFeed() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('You must be logged in to seed the feed.');
    return;
  }
  for (const post of DUMMY_POSTS) {
    try {
      await axios.post(`${API_BASE_URL}/api/feed`, post, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // eslint-disable-next-line no-console
      console.log('Dummy post created:', post.content);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Failed to create post:', post.content, err);
    }
  }
  alert('Dummy posts have been added to the feed!');
}

seedFeed();
