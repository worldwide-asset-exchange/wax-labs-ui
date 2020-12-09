import qs from "query-string";

const setQueryStringWithoutPageReload = qsValue => {
  const newurl =
    window.location.protocol +
    "//" +
    window.location.host +
    window.location.pathname +
    qsValue;
  window.history.pushState({ path: newurl }, "", newurl);
};

export const getQueryStringValue = (
  key,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString, {arrayFormat: 'comma'});
  return values[key];
};

export const setQueryStringValue = (
  key,
  value,
  queryString = window.location.search
) => {
  const values = qs.parse(queryString);
  let newQsValue = "";
  if(!value){
    delete values[key];
    newQsValue = qs.stringify({
      ...values,  
    }, {arrayFormat: 'comma'});
  } else {
    newQsValue = qs.stringify({
      ...values,
      [key]: value,  
    }, {arrayFormat: 'comma'});
  }


  
  setQueryStringWithoutPageReload(`?${newQsValue}`);
};
