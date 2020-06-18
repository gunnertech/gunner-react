// export default csvContent => {
//   const data = !csvContent.match(/^data:text\/csv/i) ? `data:text/csv;charset=utf-8,${csvContent}` : encodeURI(csvContent);
//   const link = document.createElement('a');

//   link.href = data;
//   link.download = "download.csv";

//   document.body.appendChild(link);
//   link.click();
//   // document.body.removeChild(link);
// }

//TODO: gunner-react


export default (csvContent, filename = "download.csv") => {
  var blob = new Blob([csvContent], {type: 'text/csv'});
  
  if(window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveBlob(blob, filename);
  } else {
    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();        
    document.body.removeChild(elem);
  }
}