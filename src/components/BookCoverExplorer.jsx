import React, { useState, useEffect } from "react";
import "./BookCoverExplorer.css";

function BookCoverExplorer() {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [banList, setBanList] = useState([]);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [animateCard, setAnimateCard] = useState(false);
  const [animateBanList, setAnimateBanList] = useState(false);

  const COVER_BASE_URL = "https://covers.openlibrary.org/b/id/";
  const API_BASE_URL = "https://openlibrary.org";

  const generateRandomSubject = () => {
    const subjects = [
      "fiction",
      "fantasy",
      "science_fiction",
      "mystery",
      "romance",
      "thriller",
      "biography",
      "history",
      "science",
      "philosophy",
      "psychology",
      "business",
    ];
    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
    const page = Math.floor(Math.random() * 10) + 1; // 10 pages

    return { subject: randomSubject, page: page };
  };

  const fetchRandomBook = async () => {
    const { subject, page } = generateRandomSubject();

    try {
      const response = await fetch(
        `${API_BASE_URL}/subjects/${subject}.json?limit=10&offset=${
          (page - 1) * 10
        }`
      );

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const listData = await response.json();

      if (listData.works && listData.works.length > 0) {
        const randomIndex = Math.floor(Math.random() * listData.works.length);
        const randomBook = listData.works[randomIndex];

        const bookKey = randomBook.key;

        const bookResponse = await fetch(`${API_BASE_URL}${bookKey}.json`);
        const bookData = await bookResponse.json();

        let authorName = "Unknown";
        if (bookData.authors && bookData.authors.length > 0) {
          try {
            const authorKey =
              bookData.authors[0].author?.key || bookData.authors[0].key;
            if (authorKey) {
              const authorResponse = await fetch(
                `${API_BASE_URL}${authorKey}.json`
              );
              const authorData = await authorResponse.json();
              authorName = authorData.name || "Unknown";
            }
          } catch (error) {
            console.warn("Error fetching author details:", error);
          }
        }

        let coverId = randomBook.cover_id;
        if (!coverId && bookData.covers && bookData.covers.length > 0) {
          coverId = bookData.covers[0];
        }

        const formattedBook = {
          Title: randomBook.title,
          Year: randomBook.first_publish_year
            ? randomBook.first_publish_year.toString()
            : "Unknown",
          Poster: coverId ? `${COVER_BASE_URL}${coverId}-M.jpg` : "N/A",
          Author: authorName,
          Genre: subject.replace("_", " "),
          Publisher:
            bookData.publishers && bookData.publishers.length > 0
              ? bookData.publishers[0]
              : "Unknown",
          Plot: randomBook.description
            ? typeof randomBook.description === "object"
              ? randomBook.description.value
              : randomBook.description
            : bookData.description
            ? typeof bookData.description === "object"
              ? bookData.description.value
              : bookData.description
            : "No description available.",
        };

        return formattedBook;
      }

      return null;
    } catch (err) {
      console.error("Error in fetchRandomBook:", err);
      throw err;
    }
  };

  const getRandomBook = async () => {
    if (loading) return;

    setLoading(true);
    setError(null);
    setAnimateCard(false);

    try {
      let validBook = false;
      let bookData = null;
      let attempts = 0;
      const maxAttempts = 1;

      while (!validBook && attempts < maxAttempts) {
        attempts++;

        try {
          bookData = await fetchRandomBook();

          if (bookData) {
            const author = bookData.Author;
            const genre = bookData.Genre || "Unknown";
            const publisher = bookData.Publisher || "Unknown";

            const isBanned = banList.some(
              (item) => item === author || item === genre || item === publisher
            );

            if (!isBanned) {
              validBook = true;
            }
          }
        } catch (error) {
          console.error("Attempt failed:", error);
        }

        if (!validBook && attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }

      if (validBook && bookData) {
        setBook(bookData);
        setHistory((prev) => [...prev, bookData]);
        setTimeout(() => {
          setAnimateCard(true);
        }, 50);
      } else {
        setError(
          "Couldn't find a book after multiple attempts. Your ban list might be too restrictive."
        );
      }
    } catch (err) {
      setError("Error fetching book data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addToBanList = (item) => {
    if (!banList.includes(item)) {
      setAnimateBanList(true);
      setBanList([...banList, item]);
      setTimeout(() => {
        setAnimateBanList(false);
      }, 500);
    }
  };

  const removeFromBanList = (item) => {
    setBanList(banList.filter((banned) => banned !== item));
  };

  useEffect(() => {
    getRandomBook();
  }, []);

  return (
    <div className="book-explorer">
      <h1>Book Cover Explorer</h1>
      <p>
        Discover amazing books and curate your experience by banning what you
        don't like
      </p>

      <div className={`ban-list ${animateBanList ? "pulse" : ""}`}>
        <h2>Ban List</h2>
        {banList.length === 0 ? (
          <p>
            Your ban list is empty. Click on an attribute below to add it to
            your ban list.
          </p>
        ) : (
          <ul>
            {banList.map((item, index) => (
              <li
                key={index}
                onClick={() => removeFromBanList(item)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {item} <span className="remove">(click to remove)</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        className="discover-btn"
        onClick={getRandomBook}
        disabled={loading}
      >
        {loading ? "Discovering..." : "Discover New Book"}
      </button>

      {error && <div className="error">{error}</div>}

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      )}

      {book && !loading && !error && (
        <div className={`book-card ${animateCard ? "animate" : ""}`}>
          <div className="book-cover">
            {book.Poster !== "N/A" ? (
              <img src={book.Poster} alt={`${book.Title} cover`} />
            ) : (
              <div className="no-cover">No cover available</div>
            )}
          </div>

          <div className="book-info">
            <h2>
              {book.Title} ({book.Year})
            </h2>

            <div className="attribute">
              <span className="label">Author:</span>
              <span
                className="value clickable"
                onClick={() => addToBanList(book.Author)}
                title="Click to ban this author"
              >
                {book.Author}
              </span>
            </div>

            <div className="attribute">
              <span className="label">Genre:</span>
              <span
                className="value clickable"
                onClick={() => addToBanList(book.Genre || "Unknown")}
                title="Click to ban this genre"
              >
                {book.Genre || "Unknown"}
              </span>
            </div>

            <div className="attribute">
              <span className="label">Publisher:</span>
              <span
                className="value clickable"
                onClick={() => addToBanList(book.Publisher || "Unknown")}
                title="Click to ban this publisher"
              >
                {book.Publisher || "Unknown"}
              </span>
            </div>

            <div className="attribute description">
              <span className="label">Description:</span>
              <p>{book.Plot || "No description available."}</p>
            </div>
          </div>
        </div>
      )}

      <div className="history-section">
        <button
          className="history-toggle"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? "Hide History" : "Show History"}
        </button>

        {showHistory && history.length > 0 && (
          <div className="history-list">
            <h2>Your Discovery History</h2>
            <div className="history-grid">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="history-item"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {item.Poster !== "N/A" ? (
                    <img src={item.Poster} alt={`${item.Title} cover`} />
                  ) : (
                    <div className="no-cover small">No cover</div>
                  )}
                  <div className="history-title">{item.Title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BookCoverExplorer;
