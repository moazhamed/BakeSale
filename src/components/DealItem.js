import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import PropTypes from 'prop-types';
import priceDisplay from '../util';

class DealItem extends React.Component {
  static propTypes = {
    deal: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
  };

  handlePress = () => {
    this.props.onPress(this.props.deal.key);
  };
  render() {
    return (
      <TouchableOpacity style={styles.deal} onPress={this.handlePress}>
        <Image source={{uri: this.props.deal.media[0]}} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{this.props.deal.title}</Text>
          <Text style={styles.price}>
            {priceDisplay(this.props.deal.price)}
          </Text>
          <Text style={styles.cause}>{this.props.deal.cause.name}</Text>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  deal: {
    marginHorizontal: 12,
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
    borderColor: '#bbb',
    borderWidth: 1,
    borderTopWidth: 0,
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
});
export default DealItem;
