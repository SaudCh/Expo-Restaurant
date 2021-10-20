import React, { useState, useEffect } from 'react';
import { StyleSheet, Alert } from 'react-native';
import {
    Container, Text, View, Icon, Button,
    Header, Left, Right, Title, Body, Content, Input, Form, Item, Label,
} from 'native-base';


import { COLORS } from '../const/color';

//FireBase
import * as FireBase from 'firebase';
import { firebaseConfig } from '../components/config'
if (!FireBase.apps.length) {
    FireBase.initializeApp(firebaseConfig);
}

export default function App(props) {
    const [pass, SetPass] = useState('');
    const [email, SetEmail] = useState('');

    const login = (email, pass) => {
        FireBase.auth()
            .signInWithEmailAndPassword(email, pass)
            .then(
                () => {
                    SetEmail('');
                    SetPass('');
                    props.navigation.navigate("Table");
                },
                (error) => {
                    Alert.alert(error.message);
                }
            );
    }

    return (
        <Container>
            <Header style={{ backgroundColor: COLORS.primary }}>
                <Left>
                    <Button transparent
                        onPress={() => props.navigation.openDrawer()}>
                        <Icon name='menu' />
                    </Button>
                </Left>
                <Body>
                    <Title>Login</Title>
                </Body>
            </Header>
            <Content>

                <View style={{ height: 20 }}></View>
                <View style={{ marginLeft: 10 }}>
                    <Text style={{ fontSize: 60, fontFamily: 'Ballon' }}>
                        Restaurant App,
                    </Text>
                    <Text style={{ fontSize: 30, fontFamily:'Ballon', color: '#a7b2bb' }}>
                        Login to continue!
                    </Text>
                </View>
                <View style={{ height: 60 }}></View>
                <Form>
                    <Item floatingLabel>
                        <Label style={{ color: COLORS.primary }}>Email ID</Label>
                        <Input
                            value={email}
                            onChangeText={SetEmail}
                        />
                    </Item>
                    <Item floatingLabel>
                        <Label style={{ color: COLORS.primary }}>Password</Label>
                        <Input
                            secureTextEntry={true}
                            value={pass}
                            onChangeText={SetPass}
                        />
                    </Item>
                </Form>
                <Button style={{ width: 300, alignSelf: 'center', justifyContent: 'center', marginTop: 30, backgroundColor: COLORS.primary,borderRadius:10 }}
                    onPress={() => login(email, pass)}
                >
                    <Text>Login</Text>
                </Button>

            </Content>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{ marginBottom: 20, fontSize: 30,fontFamily:'Milla' }}>For Authorize Person Only</Text>
            </View>
        </Container>

    );
}

const styles = StyleSheet.create({
});
