import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { ProgressViewIOSComponent, StyleSheet } from 'react-native';
import {
    Container, Text, View, Icon, Button,
    Header, Left, Right, Title, Body, Content, Tabs, Tab,
} from 'native-base';
import { useSelector } from 'react-redux'

import MenuItem from './menuItem'
import MenuDeal from './menuDeal'
import {COLORS} from '../const/color'

import * as FireBase from 'firebase';
import { firebaseConfig } from './config'

if (!FireBase.apps.length) {
    FireBase.initializeApp(firebaseConfig);
}

export default function App(props) {

    const cart = useSelector(state => state.cart.cart);

    return (
        <Container>
            <Header style={{ backgroundColor: COLORS.primary }} hasTabs>
                <Left>
                    <Button transparent
                        onPress={() => props.navigation.openDrawer()}>
                        <Icon name='menu' />
                    </Button>
                </Left>
                <Body>
                    <Title>Menu</Title>
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
        </Container>
    );
}