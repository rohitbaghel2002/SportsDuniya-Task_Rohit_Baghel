import React, { useState, useEffect, useCallback } from "react";
import collegesData from "./collegesData"; // Import dummy data
import "./App.css"; // Import the updated CSS

const App = () => {
  const [colleges, setColleges] = useState([]);
  const [displayedColleges, setDisplayedColleges] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [sortKey, setSortKey] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false); // To handle loading state

  useEffect(() => {
    setColleges(collegesData);
    setDisplayedColleges(collegesData.slice(0, 10));
  }, []);

  const loadMoreData = useCallback(() => {
    if (loading) return;
    setLoading(true); // Set loading state to true

    const currentLength = displayedColleges.length;
    const filteredData = filteredColleges();
    
    // Simulate a delay for loading more data
    setTimeout(() => {
      if (currentLength >= filteredData.length) {
        setHasMore(false);
        setLoading(false); // End loading state
        return;
      }

      const moreData = filteredData.slice(currentLength, currentLength + 10);
      setDisplayedColleges((prev) => [...prev, ...moreData]);
      setLoading(false); // End loading state
    }, 1000); // Simulate network delay
  }, [displayedColleges, filteredColleges, loading]);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || !hasMore) return;

      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight - 5) {
        loadMoreData();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMoreData, hasMore, loading]); // Include loadMoreData in the dependency array

  const sortColleges = (colleges) => {
    if (!sortKey) return colleges;

    const sortedColleges = [...colleges].sort((a, b) => {
      if (sortKey === "fees" || sortKey === "userReview") {
        return sortOrder === "asc"
          ? a[sortKey] - b[sortKey]
          : b[sortKey] - a[sortKey];
      }
      return sortOrder === "asc"
        ? a[sortKey].localeCompare(b[sortKey])
        : b[sortKey].localeCompare(a[sortKey]);
    });

    return sortedColleges;
  };

  const filteredColleges = () => {
    return sortColleges(
      colleges.filter((college) =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setDisplayedColleges(filteredColleges().slice(0, 10));
    setHasMore(true);
  };

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
    setDisplayedColleges(filteredColleges().slice(0, 10));
    setHasMore(true); // Reset pagination
  };

  return (
    <div className="container">
      <input
        type="text"
        placeholder="Search by college name..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />
      <table className="college-table">
        <thead>
          <tr>
            <th>CD RANK</th>
            <th onClick={() => handleSort("name")}>COLLEGE</th>
            <th onClick={() => handleSort("fees")}>COURSE FEE</th>
            <th onClick={() => handleSort("placement")}>PLACEMENTS</th>
            <th onClick={() => handleSort("userReview")}>USER REVIEW</th>
            <th onClick={() => handleSort("ranking")}>RANKING</th>
          </tr>
        </thead>
        <tbody>
          {displayedColleges.map((college, index) => (
            <tr key={college.id}>
              <td>#{index + 1}</td>
              <td>
                <div className="college-details">
                  <h3>{college.name}</h3>
                  <p>{college.location}</p>
                  <p>{college.course}</p>
                  <p>{college.cutoff}</p>
                  {college.featured && (
                    <span className="featured-badge">Featured</span>
                  )}
                  <div className="college-actions">
                    <a href="#" className="apply-now">
                      Apply Now
                    </a>{" "}
                    |
                    <a href="#" className="download-brochure">
                      Download Brochure
                    </a>
                  </div>
                </div>
              </td>
              <td>₹{college.fees.toLocaleString()}</td>
              <td>{college.placement}</td>
              <td>{college.userReview} / 10</td>
              <td>{college.ranking}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!hasMore && <p>No more colleges to show.</p>}
      {loading && <p>Loading more items...</p>}
    </div>
  );
};

export default App;
