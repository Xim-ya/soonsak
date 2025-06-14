import { View, Text, SafeAreaView } from "react-native";
import styled from "@emotion/native";
import colors from "../../../shared/styles/colors";
import { Header } from "../components/Header";


export default function HomeScreen() {
    return (
        <Container>
            {/* Header */}
            <Header />

            <Text style={{ color: colors.white }}>
                home screen
            </Text>

            {/* <SafeAreaView>
                <Text>
                    home screen
                </Text>
            </SafeAreaView> */}
        </Container >
    );
}


const Container = styled.View({
    backgroundColor: colors.black,
    flex: 1,
});