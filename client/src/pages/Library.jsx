import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import API from '../services/api';

const Library = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await API.get('/library/books');
        setBooks(response.data);
      } catch (error) {
        console.error('Library fetch failed', error);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div className="dashboard-shell">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="main-panel">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="content-area">
          <div className="page-header page-header-inline">
            <div>
              <p className="eyebrow">Library</p>
              <h2>Issued Books</h2>
            </div>
          </div>

          <section className="panel-card table-card">
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Book Name</th>
                    <th>Author</th>
                    <th>Issue Date</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book._id}>
                      <td>{book.bookName}</td>
                      <td>{book.author}</td>
                      <td>{new Date(book.issueDate).toLocaleDateString('en-GB')}</td>
                      <td>{new Date(book.dueDate).toLocaleDateString('en-GB')}</td>
                      <td>
                        <span className={`status-badge ${book.status.toLowerCase()}`}>{book.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Library;
