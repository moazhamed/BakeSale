const apiHost = 'https://bakesaleforgood.com';

export default {
  async fetchInitialDeals() {
    return fetch(apiHost + '/api/deals')
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  },
  async fetchDealDetail(dealId) {
    return fetch(apiHost + '/api/deals/' + dealId)
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  },
  async fetchDeailsSearcResults(searchTerm) {
    return fetch(apiHost + '/api/deals?searchTerm=/' + searchTerm)
      .then(response => response.json())
      .then(json => {
        return json;
      })
      .catch(error => {
        console.error(error);
      });
  },
};
