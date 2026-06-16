import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';

import type { Book } from './types'; // Using separate types file to satisfy import type

function App(): ReactElement {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000/books')
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error('Error fetching books:', error));
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Book Library</h1>
      <ul className="space-y-4">
        {books.map(book => (
          <li key={book.id} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{book.title}</h2>
            <p className="text-gray-600">Author: {book.author}</p>
            <p className="text-gray-600">Publication Year: {book.publication_year}</p>
            <p className="text-gray-600">ISBN: {book.isbn}</p>
            <p className="text-gray-600">Genre: {book.genre}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
