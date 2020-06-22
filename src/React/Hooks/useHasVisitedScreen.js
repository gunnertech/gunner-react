import { Cache } from 'aws-amplify';
import { useLocation } from "react-router-dom";

export default () => {
  // Cache.clear();
  const location = useLocation();

  const pathname = location.pathname.split("/").filter(piece => piece.length <= 30).join("/")
  
  const hasVisitedPage = !!Cache.getItem(pathname);

  !hasVisitedPage && Cache.setItem(pathname, true);


  return hasVisitedPage;
}