export const calculateRowNumbering = (
  index: number,
  page: number = 1,
  perPage: number = 1,
) => perPage * (page - 1) + (index + 1);
