import React, { useState, useEffect } from 'react';
import { StyleSheet, ToastAndroid } from 'react-native';
import {
    Container, Content, Text, Header, Left, Button, Icon, Body, Title, Right, View, Form, Item, Input
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';



import * as FireBase from 'firebase';
import { firebaseConfig } from '../components/config'
import { COLORS } from '../const/color';

if (!FireBase.apps.length) {
    FireBase.initializeApp(firebaseConfig);
}

export default function App(props) {

    const [tableNo, setTableNo] = useState()
    const [value, setValue] = useState()
    const logout = () => {
        props.navigation.navigate("Menu")
    }

    const showToast = () => {
        ToastAndroid.showWithGravityAndOffset(
            "Table has been updated",
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50
        );

    };

    const updateTable = async () => {
        try {
            await AsyncStorage.setItem('@storage_Key', tableNo)
        } catch (e) {
            // saving error
        }
        showToast()
    }


    return (
        <Container>
            <Content>
                <Header style={{ backgroundColor: COLORS.primary }}>
                    <Body>
                        <Title>Setting</Title>
                    </Body>
                    <Right>
                        <Button transparent
                            onPress={() => logout()}>
                            <Icon name='exit-outline' />
                        </Button>
                    </Right>
                </Header>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ backgroundColor: '#eceef0', fontSize: 20, fontWeight: 'bold', padding: 10 }}>Change Table</Text>
                    <View style={{ height: 150, backgroundColor: '#f4f5f6', paddingTop: 20 }}>
                        <Form>
                            <Item>
                                <Input placeholder="Table Number"
                                    value={tableNo}
                                    onChangeText={setTableNo}
                                />
                            </Item>

                        </Form>
                        <Button small rounded
                            style={{ backgroundColor: COLORS.primary, marginTop: 10, marginRight: 20, alignSelf: 'flex-end' }}
                            onPress={() => updateTable()}
                        >
                            <Text>
                                Update
                            </Text>
                        </Button>


                    </View>
                </View>
            </Content>
        </Container >
    );
}

const styles = StyleSheet.create({
});
