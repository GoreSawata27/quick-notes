// Why Fetch Inside useEffect?

// 1. We typically fetch data inside useEffect in React because it ensures
// the data is fetched only when the component is mounted (or when
// dependencies in the array change).
// 2. This prevents unnecessary re-renders on every update and improves performance.
// 3. Additionally, useEffect allows for easy cleanup of side effects
// like subscriptions when the component unmounts.
