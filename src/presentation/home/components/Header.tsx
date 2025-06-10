import { useQuery } from "@tanstack/react-query";
import { View, Text, Dimensions } from "react-native";
import TopContentModel from "../types/TopContentModel";
import { ContentType } from "@/shared/types/content/contentType.enum";
import colors from "@/shared/styles/colors";
import { useSharedValue } from "react-native-reanimated";
import styled from "@emotion/native";
import { formatter } from "@/shared/utils/formatter";
import Carousel, { ICarouselInstance, Pagination } from "react-native-reanimated-carousel";
import React from "react";
import { DotStyle } from "react-native-reanimated-carousel/lib/typescript/components/Pagination/Basic/PaginationItem";
import { EmptyView } from "@/shared/components/view/EmptyView";


const { width, height } = Dimensions.get("window");
const backdropRatio = 375 / 500;

/** 
 * 최신/대표 콘텐츠 들이 스와이프 형태로 노출 되는 뷰
 * */
export function Header() {
    const ref = React.useRef<ICarouselInstance>(null);
    const progress = useSharedValue<number>(0);


    const onPressPagination = (index: number) => {
        ref.current?.scrollTo({
            count: index - progress.value,
            animated: true,
        });
    };


    const { data, isError, isLoading } = useQuery({
        queryKey: ['topContent'],
        queryFn: async () => {
            await new Promise(resolve => setTimeout(resolve, 200)); // 200ms 딜레이
            const mockData: TopContentModel[] = [
                {
                    pointDescription: "미친듯한 미장센의 향연",
                    keywords: ['코미디', '드라마', '스릴러'],
                    backdropImgUrl: "8eihUxjQsJ7WvGySkVMC0EwbPAD.jpg",
                    id: "496243",
                    title: "기생충",
                    type: ContentType.movie
                },
                {
                    pointDescription: "질문을 던지는 드라마",
                    keywords: ["드라마", "미스터리", "판타지"],
                    backdropImgUrl: "dsMQSCOC9ReOUx0w6E1GMBMeLKS.jpg",
                    id: "95396",
                    title: "세브란스 단절",
                    type: ContentType.series
                }
            ];
            return mockData;
        }
    });

    if (isError) {
        return <Text style={{ color: colors.white }}>Error!</Text>
    }

    if (isLoading) {
        return <Text style={{ color: colors.white }}>Need to show Loading View</Text>
    }

    if ((data ?? []).isEmpty()) {
        return <EmptyView />
    }

    return (
        <HeaderContainer>
            <Carousel
                ref={ref}
                width={width}
                height={height * backdropRatio}
                data={data ?? []}
                onProgressChange={(offsetProgress, absoluteProgress) => {
                    progress.value = absoluteProgress;
                }}
                renderItem={({ item }) => (
                    <View key={item.id}>
                        <BackdropImage
                            source={{
                                uri: formatter.prefixTmdbImgUrl(item.backdropImgUrl),
                            }}
                        />
                        <Text style={{ color: colors.white, position: 'absolute', bottom: 20, left: 20 }}>{item.title}</Text>
                    </View>
                )}
            />
            <Pagination.Basic
                progress={progress}
                data={data ?? []}
                dotStyle={dotStyle(colors.gray03)}
                activeDotStyle={dotStyle(colors.gray02)}
                containerStyle={{ gap: 4 }}
                onPress={onPressPagination}
            />
        </HeaderContainer>
    );
}

const dotStyle: (backgroundColor: string) => DotStyle = (backgroundColor) => ({
    backgroundColor,
    borderRadius: 4,
    height: 4,
    width: 4,
});

const HeaderContainer = styled.View({
    aspectRatio: backdropRatio,
    width: '100%'

});

const BackdropImage = styled.Image({
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
})


