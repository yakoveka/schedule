import React from 'react';
import { View, Text, Button } from 'react-native';
import { getUsers } from '../api/mock';

export default class HomeScreen extends React.Component {
    state = { users: [], hasLoadedUsers: false, userLoadingErrorMessage: '' };

    loadUsers() {
        this.setState({ hasLoadedUsers: false, userLoadingErrorMessage: '' });
        getUsers()
            .then((users) => { // See here
                this.setState({
                    hasLoadedUsers: true,
                    users,
                });
            })
            .catch(this.handleUserLoadingError);
    }

    handleUserLoadingError = (res) => {
        if (res.error === 401) {
            this.props.navigation.navigate('Login');
        } else {
            this.setState({
                hasLoadedUsers: false,
                userLoadingErrorMessage: res.message,
            });
        }
    }

    componentDidMount() {
        this.loadUsers();
    }

    logOut = async () => {
        await setToken('');
        this.props.navigation.navigate('Login');
    };

    render() {
        const { users, userLoadingErrorMessage } = this.state;
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <Text>HomeScreen</Text>
                {users.map((user) => (
                    <Text key={user.email}>{user.email}</Text>
                ))}
                {userLoadingErrorMessage ? (
                    <Text>{userLoadingErrorMessage}</Text>
                ) : null}
                <Button title="Log out" onPress={this.logOut} />
            </View>
        );
    }
}