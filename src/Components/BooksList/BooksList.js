import React from 'react'

// Component for rendering Books
const BooksList = ({ books, onBookSelect }) => {
    return (
      <div className="books-list">
        {books.map((book) => (
          <div key={book.id} className="book" onClick={() => onBookSelect(book.id)}>
            {book.name}
          </div>
        ))}
      </div>
    );
  };
  
export default BooksList