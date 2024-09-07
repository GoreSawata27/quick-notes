"use client";

import { useEffect, useState } from "react";

function Home() {
  const [serchText, setSearchText] = useState("");

  const onsearch = () => {
    console.log("called now :", serchText);
  };

  useEffect(() => {
    const timeoutID = setTimeout(() => {
      if (serchText) {
        onsearch();
      }
    }, 500);

    return () => clearTimeout(timeoutID);
  }, [serchText]);

  const handelSearch = (e) => {
    setSearchText(e.target.value);
  };

  return (
    <div className="app">
      <input type="text" value={serchText} onChange={handelSearch} />
    </div>
  );
}

export default Home;
