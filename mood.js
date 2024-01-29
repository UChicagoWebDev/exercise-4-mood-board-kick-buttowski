const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search";
const bing_api_key = BING_API_KEY

function runSearch() {
  // TODO: Clear the results pane before you run a new search
  let searchText = document.body.querySelector("#searchText").value;
  if(searchText.trim().length == 0){
    return false;
  }
  let resultsContainer = document.body.querySelector("#resultsImageContainer");
  let suggestionsContainer = document.body.querySelector("#suggestions");
  
  let child = resultsContainer.lastElementChild;
  while (child) {
    resultsContainer.removeChild(child);
    child = resultsContainer.lastElementChild;
  }

  child = suggestionsContainer.lastElementChild;
  while (child) {
    suggestionsContainer.removeChild(child);
    child = suggestionsContainer.lastElementChild;
  }

  let imgBoard = document.body.querySelector("#board");
  let dict = {
    q: searchText,
    safeSearch: "strict",
    count: 12
  };
  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.
  let url = bing_api_endpoint + "?" + Object.keys(dict).map((key) => key+"="+encodeURIComponent(dict[key])).join("&");
  console.log(url, bing_api_key)
  openResultsPane();
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'json';
  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);
  request.onload = (event) => {
    response = event.target.response;
    console.log(response);
    
    for (const element of response.relatedSearches.slice(0, response.relatedSearches.length > 10 ? 10: response.relatedSearches.length)) {
      let listItem = document.createElement("li");
      listItem.addEventListener("click", (event) => {
        document.body.querySelector("#searchText").value = event.target.innerHTML;
        runSearch();
      });
      listItem.innerHTML = element.displayText;
      suggestionsContainer.appendChild(listItem);
    }

    for (const element of response.value) {
      let img = document.createElement("img");
      img.setAttribute("src", element.contentUrl);
      img.setAttribute("title", searchText);
      img.setAttribute("class", "resultImage");
      img.addEventListener("click", (event) => {
        let div = document.createElement("div");
        div.setAttribute("class", "savedImage");
        div.setAttribute("title", searchText);

        let a = document.createElement("a");
        a.setAttribute("href", element.hostPageUrl);
        a.setAttribute("target", "_blank");

        let inner_img = document.createElement("img");
        inner_img.setAttribute("src", element.contentUrl);
        a.appendChild(inner_img);

        let p = document.createElement("p");
        p.innerHTML = element.name;

        div.appendChild(a);
        div.appendChild(p);
        imgBoard.appendChild(div);
      })
      resultsContainer.appendChild(img)
    }
  }
  // TODO: Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  //
  //   - You'll want to specify that you want json as your response type
  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  //
  request.send();
  return false;  // Keep this; it keeps the browser from sending the event
                  // further up the DOM chain. Here, we don't want to trigger
                  // the default form submission behavior.
}

function openResultsPane() {
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open");
}

function closeResultsPane() {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open");
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch);
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") {runSearch();}
  else {}
});

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane);
document.querySelector("body").addEventListener("keydown", (e) => {
  if(e.key == "Escape") {closeResultsPane()}
});
