import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

interface IRating {
  rate: string;
  count: string;
}

interface IProduct {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: IRating;
}

function App() {
  const [data, setData] = useState<IProduct[]>([]);
  const [sortKey, setSortKey] = useState("title");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios
      .get("https://fakestoreapi.com/products")
      .then((res) => setData(res.data))
      .catch((err) => console.log(err));
  }, []);

  const handleSortClick = (key: string) => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(newSortOrder);
  };

  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredData = data?.filter((item: IProduct) =>
    item.title.toLowerCase().includes(searchTerm)
  );

  const sortedData = filteredData.sort((a: any, b: any) => {
    const field = sortKey;
    const orderBy = sortOrder === "asc" ? 1 : -1;

    if (field === "title") {
      return a.title.localeCompare(b.title) * orderBy;
    } else if (field === "category") {
      return a.category.localeCompare(b.category) * orderBy;
    } else {
      return (a.id - b.id) * orderBy;
    }
  });

  return (
    <>
      <div className="App">
        <h2>Data</h2>
        <div className="flex justify-between">
          <input
            type="text"
            placeholder="Search by Title"
            value={searchTerm}
            onChange={handleSearch}
          />
          <select
            name="sort"
            className="border border-gray-300"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
          >
            <option value="title">Title</option>
            <option value="category">Category</option>
          </select>
        </div>
        <table className="table-auto border mt-3">
          <thead>
            <tr>
              <th>
                <button onClick={() => handleSortClick("title")}>
                  Title{" "}
                  {sortKey === "title" && (
                    <i className={`fas fa-sort-${sortOrder}`}></i>
                  )}
                </button>
              </th>
              <th>
                {" "}
                <button onClick={() => handleSortClick("category")}>
                  Category{" "}
                  {sortKey === "category" && (
                    <i className={`fas fa-sort-${sortOrder}`}></i>
                  )}
                </button>
              </th>
              <th>Description</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {sortedData?.map((item: any, index) => (
              <tr key={index}>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{item.description}</td>
                <td>{item.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default App;
