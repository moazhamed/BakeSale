import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  PanResponder,
  Animated,
  Button,
  Dimensions,
  TouchableOpacity,
  Linking,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import priceDisplay from '../util';
import ajax from '../ajax';
class DealDetail extends React.Component {
  imageXPos = new Animated.Value(0);

  static propTypes = {
    intialDealDetail: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
  };

  state = {
    deal: this.props.intialDealDetail,
    imageIndex: 0,
  };

  imagePanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (ev, gs) => {
      this.imageXPos.setValue(gs.dx);
    },
    onPanResponderRelease: (ev, gs) => {
      this.screenWidth = Dimensions.get('window').width;
      if (Math.abs(gs.dx) > this.screenWidth * 0.4) {
        const direction = Math.sign(gs.dx);
        Animated.timing(this.imageXPos, {
          toValue: direction * this.screenWidth,
          duration: 250,
        }).start(() => this.handleSwipe(-1 * direction));
      } else {
        Animated.spring(this.imageXPos, {toValue: 0}).start();
      }

      console.log('RELEASE');
    },
  });

  handleSwipe = indexDirection => {
    if (!this.state.deal.media[this.state.imageIndex + indexDirection]) {
      Animated.spring(this.imageXPos, {toValue: 0}).start();
      return;
    }
    this.setState(
      prevState => {
        imageIndex: prevState.imageIndex + indexDirection;
      },
      () => {
        this.imageXPos.setValue(indexDirection * this.screenWidth);
        Animated.spring(this.imageXPos, {toValue: 0}).start();
      },
    );
  };
  async componentDidMount() {
    const fullDeal = await ajax.fetchDealDetail(this.state.deal.key);
    console.log(fullDeal);
    this.setState({deal: fullDeal});
  }
  openDealUrl = () => {
    Linking.openURL(this.state.deal.url);
  };
  render() {
    const {deal} = this.state;
    return (
      <ScrollView style={styles.deal}>
        <TouchableOpacity onPress={this.props.onBack}>
          <Text style={styles.backButton}>back</Text>
        </TouchableOpacity>

        <Animated.Image
          {...this.imagePanResponder.panHandlers}
          source={{uri: deal.media[this.state.imageIndex]}}
          style={[{left: this.imageXPos}, styles.image]}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{deal.title}</Text>
          <Text style={styles.price}>{priceDisplay(deal.price)}</Text>
          <Text style={styles.cause}>{deal.cause.name}</Text>
          {deal.user && (
            <View style={styles.author}>
              <Image source={{uri: deal.user.avatar}} style={styles.avatar} />
              <Text style={styles.authorName}>{deal.user.name}</Text>
            </View>
          )}
          <View>
            <Text>{deal.description}</Text>
          </View>
          <Button title="Buy this deal!" onPress={this.openDealUrl} />
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  deal: {
    marginTop: 12,
  },
  image: {
    width: '100%',
    height: 150,
    backgroundColor: '#ccc',
  },
  info: {
    padding: 10,
    backgroundColor: '#fff',
  },
  name: {
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },
  price: {
    textAlign: 'right',
    flex: 1,
  },
  cause: {
    flex: 2,
  },
  avatar: {
    height: 60,
    width: 60,
    borderRadius: 20,
  },
  authorName: {},
  author: {
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    margin: 20,
  },
  backButton: {
    marginBottom: 10,
    marginLeft: 10,
    color: '#22f',
    fontSize: 17,
  },
});
export default DealDetail;
