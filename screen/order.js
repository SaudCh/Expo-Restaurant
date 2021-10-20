import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, ActivityIndicator, Dimensions } from 'react-native';
import {
    Container, Text, View, Icon, Button,
    Header, Left, Right, Title, Body, Content, Footer
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../const/color';
import { useDispatch } from 'react-redux'
import * as FireBase from 'firebase';
import { firebaseConfig } from '../components/config'
if (!FireBase.apps.length) {
    FireBase.initializeApp(firebaseConfig);
}

import { delCart } from '../store/action/item'

const windowHeight = Dimensions.get('window').height;

const fire = FireBase.firestore()

export default function App(props) {
    const [data, setData] = useState('')
    const { tab } = props.route.params

    const dispatch = useDispatch();

    const deleteCart = () => {
        dispatch(delCart());
    }

    const orderComp = () => {
        deleteCart()
        props.navigation.navigate("Menu")
    }

    useEffect(() => {

        fire.collection('Order')
            .doc(tab)
            .onSnapshot(documentSnapshot => {
                console.log('User data: ', documentSnapshot.data());
                setData(documentSnapshot.data());
            });
    }, []);

    const renderOrd = (status, navigation) => {
        if (status == 1) {
            return (
                <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 25, padding: 5 }}>
                        Table No: {data.table}
                    </Text>
                    <Text style={{ fontSize: 25, padding: 5 }}>Items</Text>
                    <View>
                        <FlatList
                            data={data.item}
                            keyExtractor={({ id }, index) => id}
                            renderItem={({ item }) => (
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 5 }}>
                                    <Text>{item.name}  x{item.quantity}  </Text>
                                    <Text>{item.price} Rs</Text>
                                </View>
                            )}
                        />
                    </View>
                    <View style={{ borderTopWidth: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ padding: 5, }}>Sub Total</Text>
                        <Text style={{ padding: 5, }}>{data.total} Rs</Text>
                    </View>
                    <View style={{ borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ padding: 5, }}>Tax</Text>
                        <Text style={{ padding: 5, }}>00 Rs</Text>
                    </View>
                    <View style={{ position: 'absolute', bottom: 0, padding: 5 }}>
                        <View style={{ borderBottomWidth: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontSize: 20, padding: 5, }}>Total</Text>
                            <Text style={{ fontSize: 20, padding: 5, }}>{data.total} Rs</Text>
                        </View>
                        <Text style={{ color: 'red' }}>Note:</Text>
                        <Text>In case of change of order. Or want to order something new please ask the waiter</Text>
                    </View>
                </View >
            )
        } else {
            return (
                <View>
                    <Text>Your Order Has Completed</Text>
                    <Button
                        onPress={orderComp()}
                    >
                        <Text>Your Order Has Completed</Text>
                    </Button>
                </View>

            )
        }
    }

    if (data) {
        return (
            <Container>
                <Header style={{ backgroundColor: COLORS.primary }} hasTabs>
                    <Left>

                    </Left>
                    <Body>
                        <Title>Your Order</Title>
                    </Body>
                </Header>
                <Content style={{ margin: 5, }}>
                    <View style={{ height: windowHeight - 80 }}>{renderOrd(data.status, props.navigation)}</View>
                </Content>
            </Container>

        );
    } else {
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
                        <Title>Your Order</Title>
                    </Body>
                </Header>
                <Content>
                    <View style={{ ...styles.activityContainer }}>
                        <ActivityIndicator size="large" color={COLORS.primary} />
                    </View>
                </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    activityContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        height: 800,
    }
});