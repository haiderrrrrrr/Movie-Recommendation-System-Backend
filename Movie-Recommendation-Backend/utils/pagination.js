// Cursor-Based Pagination Utility
const getCursorPaginationParams = (req) => {
  const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10; // Default to 10 items per page if not provided or invalid
  const cursor = req.query.cursor; // Expecting the ID of the last item in the current page as the cursor

  // If a cursor is provided, we'll only get records with an ID greater than the cursor.
  const query = cursor ? { _id: { $gt: cursor } } : {};

  return {
    limit,
    query,
  };
};

module.exports = getCursorPaginationParams;
