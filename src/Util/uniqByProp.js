export default prop =>
  !!prop ? (
    (ele, i, arr) => arr.map(ele => ele[prop]).indexOf(ele[prop]) === i
  ) : (
    (ele, i, arr) => arr.indexOf(ele) === i
  )