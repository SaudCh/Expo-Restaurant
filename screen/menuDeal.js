import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, SectionList, Image, LogBox, ImageBackground, FlatList, Modal, ToastAndroid } from 'react-native';
import {
    Container, Text, View, Icon, Button,
    Header, Left, Right, Title, Body, Content
} from 'native-base';
import { useFocusEffect } from '@react-navigation/native';

import { useSelector, useDispatch } from 'react-redux'

import { COLORS } from '../const/color'
import { addtoCart } from '../store/action/item'

import * as FireBase from 'firebase';
import { firebaseConfig } from '../components/config'
if (!FireBase.apps.length) {
    FireBase.initializeApp(firebaseConfig);
}

const fire = FireBase.firestore()

export default function App(props) {

    LogBox.ignoreAllLogs();//Ignore all log notifications


    const [data, setData] = useState('')
    const [refresh, setRefresh] = useState(1)
    const [modalVisible, setModalVisible] = useState(false);


    var newArray = [];

    useEffect(() => {
        fire.collection('deals')
            .get()
            .then(querySnapshot => {
                //console.log('Total users: ', querySnapshot.size);

                querySnapshot.forEach(documentSnapshot => {
                    //console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
                    newArray.push(documentSnapshot.data());
                });
                setData(newArray);
            });
    }, [refresh]);

    const dispatch = useDispatch();

    const [mId, setmId] = useState('')
    const [mPrice, setmPrice] = useState()
    const [mName, setmName] = useState('')
    const [mquan, setmquan] = useState(1);
    const [tot, setTot] = useState();
    const openModal = (id, price, name) => {
        setmId(id);
        setmPrice(price);
        setmName(name);
        setTot(price);
        setmquan(1);
        setModalVisible(true)
        //dispatch(addtoCart(id, price, name));
    }

    const decQuan = () => {
        if (mquan > 1) {
            setmquan(quan => quan - 1)
            setTot(mPrice * (mquan - 1))
        } else {
            setmquan(1)
        }
    }

    const incQuan = () => {

        setmquan(quan => quan + 1)
        setTot(mPrice * (mquan + 1))

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

    const addcart = () => {
        dispatch(addtoCart(mId, tot, mName, mquan));
        setModalVisible(!modalVisible)
        showToast()
    }
    const ViewDetail = (itm) => {
        props.navigation.navigate("dealDetail", {
            item: itm,
        })
    }
    return (
        <Container style={{ backgroundColor: COLORS.light }}>
            <Content style={{ margin: 10 }}>
                <Text style={{ alignSelf: 'center', fontSize: 32, fontFamily: 'Ballon' }}>Deals</Text>
                <FlatList
                    data={data}
                    renderItem={
                        ({ item }) => (
                            <View style={{ ...styles.card }}>
                                <ImageBackground
                                    source={require('../assets/img/pngegg.png')}
                                    style={{ height: 50 }}
                                >
                                    <Text style={{ paddingLeft: 60, paddingTop: 12, fontSize: 21, color: '#fff', fontWeight: 'bold', fontStyle: 'italic' }}>{item.name}</Text>
                                </ImageBackground>
                                <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Deal Includes:</Text>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ marginLeft: 10 }}>
                                        {item.Items.map((item) => (<Text>{item}</Text>))}
                                    </View>
                                    <View>
                                        <View style={{ position: 'absolute', right: 20, top: -10 }}>
                                            <ImageBackground
                                                source={require('../assets/img/star.png')}
                                                style={{ height: 70, width: 90, justifyContent: 'center' }}
                                            >
                                                <Text style={{ alignSelf: 'center', color: '#000', fontWeight: 'bold', fontSize: 20, paddingTop: 3, paddingRight: 3 }}>{item.price}</Text>
                                            </ImageBackground>
                                        </View>
                                    </View>
                                </View>
                                <View style={{ paddingVertical: 5, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Button style={{ ...styles.cardButton }} small
                                        onPress={() => ViewDetail(item)}
                                    >
                                        <Text style={{}}>View Detail</Text>
                                    </Button>
                                    <Button style={{ ...styles.cardButton }} small
                                        onPress={() => openModal(item.id, item.price, item.name)}
                                    >
                                        <Text style={{}}>Add to cart</Text>
                                    </Button>
                                </View>
                            </View>
                        )
                    }
                    keyExtractor={item => item.id}
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                        setModalVisible(!modalVisible);
                    }}
                >
                    <View style={{ ...styles.centeredView }}>
                        <View style={styles.modalView}>
                            <View style={{ height: 15 }}></View>
                            <Text style={{ fontSize: 25 }}>Add to Cart</Text>
                            <View style={{ height: 15 }}></View>
                            <View style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 20 }}>Name: </Text>
                                <Text style={{ fontSize: 20 }}>{mName}</Text>
                            </View>
                            <View style={{ height: 15 }}></View>
                            <View style={{ alignItems: 'center', width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 20 }}>Quantity:</Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Button transparent
                                        onPress={() => decQuan()}
                                    >
                                        <Icon name="remove" />
                                    </Button>
                                    <Text style={{ fontSize: 30 }} >  {mquan}  </Text>
                                    <Button transparent
                                        onPress={() => incQuan()}
                                    >
                                        <Icon name="add" />
                                    </Button>
                                </View>
                            </View>
                            <View style={{ height: 15 }}></View>
                            <View style={{ width: '100%', paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 20 }}>Price: </Text>
                                <Text style={{ fontSize: 20 }}>{tot} Rs</Text>
                            </View>
                            <View style={{ height: 10 }}></View>
                            <View style={{ width: '100%', margin: 10, paddingHorizontal: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Button transparent small
                                    onPress={() => setModalVisible(!modalVisible)}
                                >
                                    <Text style={styles.textStyle}>Cancel</Text>
                                </Button>
                                <Button style={{ ...styles.cardButton }} small
                                    onPress={() => addcart()}
                                >
                                    <Text style={styles.textStyle}>Add to cart</Text>
                                </Button>
                            </View>
                            <View style={{ height: 20 }}></View>
                        </View>
                    </View>
                </Modal>
            </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    tinyLogo: {
        height: 150
    },
    card: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        marginVertical: 10,
        borderRadius: 25,
        overflow: 'hidden',
        backgroundColor: COLORS.white,
        shadowColor: COLORS.black,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 20,
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%'
    },
    cardButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10
    }
});
