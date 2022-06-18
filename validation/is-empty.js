const isEmpty = (value) =>
  value === undefined ||
  value === null ||
  value===0||
  (typeof value === "object" && Object.keys(value).length === 0) ||
  (typeof value === "boolean" && value===false) ||
  (typeof value === "string" && value.trim().length === 0);
module.exports = isEmpty;
