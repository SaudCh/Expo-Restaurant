import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, SectionList, Image, LogBox, ToastAndroid, ImageBackground, Modal } from 'react-native';
import {
    Container, Text, View, Icon, Button,
    Header, Left, Right, Title, Body, Content
} from 'native-base';
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
    const [refresh, setRefresh] = useState(true)
    const [modalVisible, setModalVisible] = useState(false);


    var newArray = [];

    useEffect(() => {
        fire.collection('items')
            .get()
            .then(querySnapshot => {
                //console.log('Total users: ', querySnapshot.size);

                querySnapshot.forEach(documentSnapshot => {
                    //console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
                    newArray.push(documentSnapshot.data());
                });
                setData(newArray);
                //console.log(data);
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
        dispatch(
            addtoCart(mId, tot, mName, mquan));
        setModalVisible(!modalVisible);
        showToast()
    }
    const navi = () => {
        props.navigation.navigate('Cart');
    }
    const ViewDetail = (itm) => {
        //console.log(itm)
        props.navigation.navigate("itemDetail", {
            item: itm,
        })
    }
    return (
        <Container style={{ backgroundColor: '#f5f5f5' }}>
            <Content style={{ margin: 5 }}>

                <Text style={{ alignSelf: 'center', fontSize: 32, fontFamily: 'Ballon' }}>Items</Text>

                <SectionList
                    sections={data}
                    renderItem={({ item }) =>
                        <View
                            style={{ ...styles.card }}>
                            <View style={{}}>
                                <Image
                                    style={styles.tinyLogo}
                                    source={{
                                        uri: item.img,
                                    }}
                                />
                                <View style={{ padding: 5 }}>
                                    <Text style={{ fontSize: 20 }}>Name: {item.itemName}</Text>
                                    <Text>Price: {item.price} Rs</Text>
                                </View>
                            </View>
                            <View style={{ paddingBottom: 15, paddingHorizontal: 15, flexDirection: 'row', justifyContent: 'space-between' }}>

                                <Button style={{ ...styles.cardButton }} small
                                    onPress={() => ViewDetail(item)}
                                >
                                    <Text style={{}}>View Detail</Text>
                                </Button>
                                <Button style={{ ...styles.cardButton }} small
                                    onPress={() => openModal(item.itemId, item.price, item.itemName)}
                                >
                                    <Text>Add to cart</Text>
                                </Button>
                            </View>
                        </View>
                    }
                    renderSectionHeader={({ section: { category } }) =>
                    (
                        <ImageBackground
                            source={require('../assets/img/pngegg.png')}
                            style={{ height: 50, }}
                        >
                            <Text style={{ paddingLeft: 60, paddingTop: 4, fontStyle: 'italic', fontSize: 32, color: 'white', fontWeight: 'bold' }}>{category}</Text>
                        </ImageBackground>
                    )}
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
        marginTop: 5,
        marginBottom: 15,
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
        elevation: 10,
        width: '90%'
    },
    cardButton: {
        backgroundColor: COLORS.primary,
        borderRadius: 10
    }
});
