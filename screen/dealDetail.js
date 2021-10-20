import React, { useState, useEffect } from 'react';
import { StyleSheet, ToastAndroid, Image } from 'react-native';
import {
    Container, Text, View, Icon, Button,
    Header, Left, Right, Title, Body, Content
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux'
import { COLORS } from '../const/color';
import { addtoCart } from '../store/action/item'


export default function App(props) {

    const cart = useSelector(state => state.cart.cart);
    const { item } = props.route.params

    const [Quantity, setQuantity] = useState(1);
    const [Total, setTot] = useState(item.price);
    const decQuan = () => {
        if (Quantity > 1) {
            setQuantity(quan => quan - 1)
            setTot(item.price * (Quantity - 1))
        } else {
            setQuantity(1)
        }
    }

    const incQuan = () => {

        setQuantity(quan => quan + 1)
        setTot(item.price * (Quantity + 1))

    }

    const showToast = () => {
        ToastAndroid.showWithGravityAndOffset(
            "Item has been added to the cart",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );

    };


    const dispatch = useDispatch();

    const addcart = (id, tot, name, quan) => {
        dispatch(
            addtoCart(id, tot, name, quan));
        showToast()
    }


    return (
        <Container>
            <Header style={{ backgroundColor: COLORS.primary }} hasTabs>
                <Left>
                    <Button transparent
                        onPress={() => props.navigation.goBack()}>
                        <Ionicons name="arrow-back-outline" size={24} color="white" />
                    </Button>
                </Left>
                <Body>
                    <Title>{item.name}</Title>
                </Body>
                <Right>
                    <Button transparent
                        onPress={() => props.navigation.navigate('Cart')}>
                        <Icon name='cart' />
                        <View style={{ position: 'absolute', right: 0, top: 0, width: 15, backgroundColor: 'red', borderRadius: 50, alignItems: 'center' }}>
                            <Text style={{ color: 'white' }}>{cart.length}</Text>
                        </View>
                    </Button>
                </Right>
            </Header>
            <Content>
                <View>
                    <Image
                        style={styles.tinyLogo}
                        source={{
                            uri: item.img,
                        }}
                    />
                </View>
                <View style={{ margin: 5 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 35 }}>{item.name}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Price:</Text>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.price} Rs</Text>
                    </View>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Deal Includes:</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View style={{ marginLeft: 10 }}>
                            {item.Items.map((item) => (<Text>{item}</Text>))}
                        </View>
                    </View>
                    </View>
            </Content>
                <View style={{ ...styles.totCard }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Quantity</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <Button transparent
                                onPress={() => decQuan()}
                            >
                                <Icon name="remove" />
                            </Button>
                            <Text style={{ fontSize: 30 }} >  {Quantity}  </Text>
                            <Button transparent
                                onPress={() => incQuan()}
                            >
                                <Icon name="add" />
                            </Button>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 20, paddingRight: 50 }}>
                        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Total</Text>
                        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{Total} Rs</Text>
                    </View>
                </View>
                <View style={{ marginBottom: 20, marginRight: 20, }}>
                    <Button small style={{ alignSelf: 'flex-end', ...styles.cardButton }}
                        onPress={() => addcart(item.id, Total, item.name, Quantity)}
                    >
                        <Text>Add to Cart</Text>
                    </Button>
                </View>
        </Container>

    );
}

const styles = StyleSheet.create({
                tinyLogo: {
                height: 200
    },
    totCard: {
                borderTopWidth: 1,
        paddingVertical: 10,
    },
    cardButton: {
                backgroundColor: COLORS.primary,
        borderRadius: 10
    }
});