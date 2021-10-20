import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import {
    Container, Text, View, Icon, Button,
    Header, Left, Right, Title, Body, Content, Footer
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native';
import { remItem } from '../store/action/item'
import { delCart } from '../store/action/item'
import { COLORS } from '../const/color';
import AsyncStorage from '@react-native-async-storage/async-storage';

//FireBase
import * as FireBase from 'firebase';
import { firebaseConfig } from '../components/config'
if (!FireBase.apps.length) {
    FireBase.initializeApp(firebaseConfig);
}
const fire = FireBase.firestore().collection("Order")



export default function App(props) {

    const [total, setTotal] = useState(0);
    const [pr, setPr] = useState(0);
    const [value, setValue] = useState()
    const cart = useSelector(state => state.cart.cart);
    const [table, setTable] = useState()
    var minutes = 1000 * 60;
    var hours = minutes * 60;
    var days = hours * 24;
    var years = days * 365;
    var d = new Date();


    useFocusEffect(
        React.useCallback(() => {
            AsyncStorage.getItem('@storage_Key')
                .then((val) => {
                    setTable(val)
                })
        })
    );

    var tot = 0;

    useFocusEffect(
        React.useCallback(() => {
            tot = 0;
            for (var i = 0; i < cart.length; i++) {
                //console.log(cart[i].price)
                tot = tot + parseInt(cart[i].price)
            }
            setTotal(tot)
        })
    );

    if (cart.length == 0) {
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
                        <Title>Cart</Title>
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
                <Content style={{ margin: 5 }}>
                    <View style={{ height: 200 }}></View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <Icon name='sad-outline' style={{ fontSize: 100 }} />
                        <Text style={{ fontSize: 70, fontFamily: 'Milla' }}>I am Empty</Text>
                        <Text style={{ fontSize: 40, fontFamily: 'Milla', color: '#a7b2bb' }}>Fill Me Up</Text>
                        <Button style={{ borderRadius: 10, alignSelf: 'center', justifyContent: 'center', marginTop: 10, backgroundColor: COLORS.primary }}
                            onPress={() => props.navigation.navigate('Menu')}
                        >
                            <Text>Menu</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        )
    }

    const dispatch = useDispatch();
    const delItem = (id) => {
        dispatch(remItem(id));
    }

    const deleteCart = () => {
        dispatch(delCart());
    }

    const confirmOrder = () => {
        fire.doc().set({
            item: cart,
            table: table,
            time: d

        })
            .then(() => {
                console.log('Document successfully written!');
            })
            .catch((error) => {
                console.error('Error writing document: ', error);
            });
        props.navigation.navigate("Order")
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
                    <Title>Cart</Title>
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
            <Content style={{ margin: 5 }}>
                <Text style={{ alignSelf: 'center', fontSize: 32, fontFamily: 'Ballon' }}>Cart</Text>
                <FlatList
                    data={cart}
                    keyExtractor={item => item.id}
                    renderItem={
                        ({ item }) => (
                            <View style={{ ...styles.card, paddingBottom: 10 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{item.name}</Text>
                                    <Button small danger
                                        onPress={() => delItem(item.id)}
                                    >
                                        <Icon name="trash" />
                                    </Button>
                                </View>
                                <View style={{ height: 10 }}></View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Price:</Text>
                                    <Text>{item.price}</Text>

                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Text>Quantity:</Text>
                                    <Text>{item.quantity}</Text>
                                </View>
                            </View>
                        )
                    }
                />
            </Content>
            <View style={{ ...styles.totCard }}>
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>Total:</Text>
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{total}</Text>
            </View>
            <View style={{ marginBottom: 20, marginRight: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button danger small style={{ marginLeft: 10 }}
                    onPress={() => deleteCart()}
                >
                    <Text>Delete All</Text>
                </Button>
                <Button small style={{}}
                    onPress={() => confirmOrder()}
                >
                    <Text>Confirm Order</Text>
                </Button>
            </View>
        </Container>

    );
}

const styles = StyleSheet.create({
    card: {
        marginVertical: 5,
        borderWidth: 1,
        borderRadius: 25,
        overflow: 'hidden',
        backgroundColor: '#fff',
        padding: 5,
    },
    totCard: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        height: 50,
        alignContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    }
});
