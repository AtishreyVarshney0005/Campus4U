import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

const News = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [news, setNews] = useState([]);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await API.get('/news');
        setNews(response.data);
      } catch (error) {
        console.error('News fetch failed', error);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="dashboard-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-panel">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content-area">
          <div className="page-header page-header-inline">
            <div>
              <p className="eyebrow">Campus</p>
              <h2>College News</h2>
            </div>
          </div>

          <div className="news-grid">
            {news.map((item) => (
              <article className="news-card" key={item._id}>
                <div className="news-top">
                  <span className="tag">{item.category}</span>
                  <small>{new Date(item.date).toLocaleDateString('en-GB')}</small>
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <button className="text-btn">Read More</button>
              </article>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default News;
