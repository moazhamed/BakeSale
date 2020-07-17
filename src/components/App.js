import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import ajax from '../ajax';
import DealList from './DealList';
import DealDetail from './DealDetail';
import SearchBar from './SearchBar';

class App extends React.Component {
  titleXPos = new Animated.Value(0);
  state = {
    deals: [],
    dealsFromSearch: [],
    currentDealId: null,
  };

  searchDeals = async searchTerm => {
    let dealsFromSearch = [];
    if (searchTerm) {
      dealsFromSearch = await ajax.fetchDeailsSearcResults(searchTerm);
    }
    this.setState({dealsFromSearch});
  };

  animateTitle = (direction = 1) => {
    const screenWidth = Dimensions.get('window').width - 160;
    Animated.timing(this.titleXPos, {
      toValue: direction * (screenWidth / 2),
      duration: 1000,
      easing: Easing.ease,
    }).start(({finished}) => {
      //this finish object is an end callback from start to stop the loop
      if (finished) {
        this.animateTitle(-1 * direction);
      }
    });
  };

  async componentDidMount() {
    this.animateTitle();
    const deals = await ajax.fetchInitialDeals();
    this.setState({deals});
  }

  setCurrentDeal = dealId => {
    this.setState({currentDealId: dealId});
  };

  setCurrenDealToNull = () => {
    this.setState({currentDealId: null});
  };

  currentDeal = dealId => {
    return this.state.deals.find(deal => deal.key === this.state.currentDealId);
  };

  render() {
    if (this.state.currentDealId) {
      return (
        <DealDetail
          style={styles.main}
          intialDealDetail={this.currentDeal()}
          onBack={this.setCurrenDealToNull}
        />
      );
    }
    const dealsToDisplay =
      this.state.dealsFromSearch.length > 0
        ? this.state.dealsFromSearch
        : this.state.deals;

    if (dealsToDisplay.length > 0) {
      return (
        <View style={styles.main}>
          <SearchBar searchDeals={this.searchDeals} />
          <DealList deals={dealsToDisplay} onItemPress={this.setCurrentDeal} />
        </View>
      );
    }

    return (
      <Animated.View style={[{left: this.titleXPos}, styles.container]}>
        <Text style={styles.header}>BakeSale</Text>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    marginTop: 13,
  },
  header: {
    fontSize: 40,
  },
});

export default App;
