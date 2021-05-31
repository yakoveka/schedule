import React from 'react';
import { View, Text, Button, StyleSheet, AppRegistry  } from 'react-native';
import { getUsers } from '../api/mock';
import {setToken} from "../api/token";
import { NativeRouter, Route, Link } from "react-router-native";

const Home = () => <Text style={styles.header}>Home</Text>;

const About = () => <Text style={styles.header}>About</Text>;

const Topic = ({ match }) => (
    <Text style={styles.topic}>{match.params.topicId}</Text>
);

const Topics = ({ match }) => (
    <View>
        <Text style={styles.header}>Topics</Text>
        <View>
            <Link
                to={`${match.url}/rendering`}
                style={styles.subNavItem}
                underlayColor="#f0f4f7"
            >
                <Text>Rendering with React</Text>
            </Link>
            <Link
                to={`${match.url}/components`}
                style={styles.subNavItem}
                underlayColor="#f0f4f7"
            >
                <Text>Components</Text>
            </Link>
            <Link
                to={`${match.url}/props-v-state`}
                style={styles.subNavItem}
                underlayColor="#f0f4f7"
            >
                <Text>Props v. State</Text>
            </Link>
        </View>

        <Route path={`${match.path}/:topicId`} component={Topic} />
        <Route
            exact
            path={match.path}
            render={() => (
                <Text style={styles.topic}>Please select a topic.</Text>
            )}
        />
    </View>
);

export default class HomeScreen extends React.Component {
    state = { users: [], hasLoadedUsers: false, userLoadingErrorMessage: '' };

    loadUsers() {
        this.setState({ hasLoadedUsers: false, userLoadingErrorMessage: '' });
        getUsers()
            .then((res) =>
                this.setState({
                    hasLoadedUsers: true,
                    users: res.users,
                }),
            )
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
        this.didFocusSubscription = this.props.navigation.addListener(
            'didFocus',
            () => {
                if (!this.state.hasLoadedUsers) {
                    this.loadUsers();
                }
            },
        );
    }

    componentWillUnmount() {
        this.didFocusSubscription.remove();
    }

    logOut = async () => {
        this.setState({ hasLoadedUsers: false, users: [] })
        await setToken('');
        this.props.navigation.navigate('Login');
    };

    render() {
        const { users, userLoadingErrorMessage } = this.state;
        return (
            <NativeRouter>
                <View style={styles.container}>
                    <View style={styles.nav}>
                        <Link to="/" underlayColor="#f0f4f7" style={styles.navItem}>
                            <Text>Home</Text>
                        </Link>
                        <Link
                            to="/about"
                            underlayColor="#f0f4f7"
                            style={styles.navItem}
                        >
                            <Text>About</Text>
                        </Link>
                        <Link
                            to="/topics"
                            underlayColor="#f0f4f7"
                            style={styles.navItem}
                        >
                            <Text>Topics</Text>
                        </Link>
                    </View>

                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/topics" component={Topics} />
                    <Button title="Log out" onPress={this.logOut} />
                </View>
            </NativeRouter>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 25,
        padding: 10
    },
    header: {
        fontSize: 20
    },
    nav: {
        flexDirection: "row",
        justifyContent: "space-around"
    },
    navItem: {
        flex: 1,
        alignItems: "center",
        padding: 10
    },
    subNavItem: {
        padding: 5
    },
    topic: {
        textAlign: "center",
        fontSize: 15
    }
});