import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList } from 'react-native';
import {
    Container, Text, View, Icon, Button,
    Header, Left, Right, Title, Body, Content, Footer
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { COLORS } from '../const/color';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FireBase from 'firebase';
import { firebaseConfig } from '../components/config'
if (!FireBase.apps.length) {
    FireBase.initializeApp(firebaseConfig);
}

const fire = FireBase.firestore()


export default function App(props) {
    const [data, setData] = useState('')


    var newArray = [];

    useEffect(() => {
        fire.collection('Order')
            .get()
            .then(querySnapshot => {
                //console.log('Total users: ', querySnapshot.size);

                querySnapshot.forEach(documentSnapshot => {
                    //console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
                    newArray.push(documentSnapshot.data());
                });
                setData(newArray);
                console.log(data[0].item);
            });
    }, []);

    const [value, setValue] = useState()

    useFocusEffect(
        React.useCallback(() => {
            AsyncStorage.getItem('@storage_Key')
                .then((val) => {
                    setValue(val)
                })
        })
    );

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
                    <Title>Confirm Order</Title>
                </Body>
            </Header>
            <Content style={{ margin: 5 }}>
                <Text style={{ padding: 5 }}>
                    Table No: {value}
                </Text>
            </Content>
        </Container>

    );
}

const styles = StyleSheet.create({

});