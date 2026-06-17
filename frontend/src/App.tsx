import React, { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

import type { Book } from './types';

function App(): ReactElement {
  const [books, setBooks] = useState<Book[]>([]);

  // Form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [isbn, setIsbn] = useState('');
  const [genre, setGenre] = useState('');

  const [scannerVisible, setScannerVisible] = useState(false);

  const fetchBooks = () => {
    fetch('http://localhost:8000/books')
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error('Error fetching books:', error));
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    let qrCodeInstance: Html5Qrcode | null = null;

    if (scannerVisible) {
      qrCodeInstance = new Html5Qrcode("reader");

      qrCodeInstance.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          setIsbn(decodedText);
          setScannerVisible(false); // This will trigger the cleanup
        },
        (_errorMessage) => {
          // ignore background scan errors
        }
      ).catch((err) => {
        console.error("Error starting scanner:", err);
      });
    }

    // Cleanup function when component unmounts or scanner becomes invisible
    return () => {
      if (qrCodeInstance && qrCodeInstance.isScanning) {
        qrCodeInstance.stop().then(() => {
          qrCodeInstance?.clear();
        }).catch((err) => {
          console.error("Failed to stop scanner", err);
        });
      }
    };
  }, [scannerVisible]);

  const handleDelete = (id: number) => {
    fetch(`http://localhost:8000/books/${id}`, {
      method: 'DELETE',
    })
    .then(() => fetchBooks())
    .catch(error => console.error('Error deleting book:', error));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newBook = {
      title,
      author,
      publication_year: publicationYear ? parseInt(publicationYear, 10) : null,
      isbn,
      genre
    };

    fetch('http://localhost:8000/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    })
    .then(response => response.json())
    .then(() => {
      fetchBooks();
      setTitle('');
      setAuthor('');
      setPublicationYear('');
      setIsbn('');
      setGenre('');
    })
    .catch(error => console.error('Error adding book:', error));
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Book Library</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Add a New Book</h2>
          <form onSubmit={handleSubmit} className="space-y-4 border p-4 rounded shadow bg-gray-50">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Author</label>
              <input type="text" value={author} onChange={e => setAuthor(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Publication Year</label>
              <input type="number" value={publicationYear} onChange={e => setPublicationYear(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-white" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">ISBN</label>
              <div className="flex gap-2">
                <input type="text" value={isbn} onChange={e => setIsbn(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-white" />
                <button type="button" onClick={() => setScannerVisible(!scannerVisible)} className="mt-1 bg-blue-500 text-white px-4 py-2 rounded font-semibold hover:bg-blue-600">
                  {scannerVisible ? 'Close Scanner' : 'Scan Barcode'}
                </button>
              </div>
            </div>

            <div id="reader" className={`w-full mt-4 bg-white border rounded shadow-inner ${scannerVisible ? 'block' : 'hidden'}`}></div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Genre</label>
              <input type="text" value={genre} onChange={e => setGenre(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2 bg-white" />
            </div>
            <button type="submit" className="w-full bg-green-600 text-white px-4 py-2 rounded font-bold hover:bg-green-700 transition-colors">Add Book</button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Inventory</h2>
          <ul className="space-y-4">
            {books.map(book => (
              <li key={book.id} className="p-4 border rounded shadow bg-white hover:shadow-md transition-shadow relative">
                <button
                  onClick={() => handleDelete(book.id)}
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                  aria-label="Delete Book"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <h3 className="text-xl font-bold text-gray-900 pr-8">{book.title}</h3>
                <p className="text-gray-700 text-sm mb-2 font-medium">by {book.author}</p>
                <div className="grid grid-cols-2 text-sm text-gray-500 gap-1">
                  <p>Year: <span className="font-medium text-gray-800">{book.publication_year || 'N/A'}</span></p>
                  <p>ISBN: <span className="font-medium text-gray-800">{book.isbn || 'N/A'}</span></p>
                  <p>Genre: <span className="font-medium text-gray-800">{book.genre || 'N/A'}</span></p>
                </div>
              </li>
            ))}
            {books.length === 0 && <p className="text-gray-500 italic p-4 bg-gray-50 rounded border text-center">No books in inventory yet.</p>}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default App;
