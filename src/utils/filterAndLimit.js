export default (list, sorter, limit) => {
  if (!list) {
    return [];
  }

  let sorted = list;
  if (sorter) {
    sorted = sortBy(list, sorter);
  }

  const _limit = limit || 0;
  if (_limit === 0) {
    return sorted;
  }

  // slice, then reverse elements to get the proper order
  return sorted.slice(0, _limit).reverse();
};
