import { useQueries, useQuery } from "@tanstack/react-query";
import { Image, View, Text, TouchableHighlight } from "react-native";
import { ContentSectionListModel, recentContentSectionMokcs } from "../types/contentSectionListModel";
import styled from "@emotion/native";
import appTextStyle from "@/shared/styles/textStyles";
import colors from "@/shared/styles/colors";
import { FlatList } from "react-native-gesture-handler";
import Gap from "@/shared/components/view/Gap";
import { formatter, TmdbImageSize } from "@/shared/utils/formatter";
import { contentApi } from "@/features/content/api/contentApi";
import { BaseContentModel } from "@/shared/types/content/baseContentModel";


export function RecentContentView() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["recentContent"],
        queryFn: async (): Promise<ContentSectionListModel> => {

            const items = await contentApi.getRecentUploadedContents();

            const mappedSection: ContentSectionListModel = {
                id: "recent",
                sectionTitle: "최신 콘텐츠",
                contents: items.map((e) => BaseContentModel.fromContentDto(e)),
            };

            return mappedSection;



        }
    });
    if (isError) {
        return <Text>Unexcpected Error Occured</Text>
    }

    if (isLoading) {
        return <Text>isLoading</Text>
    }

    if (data == null || data.contents.length == 0) {
        return <Text>Unexcpected Error Occured</Text>
    }

    return <Container>
        <SeectionTitle>{data.sectionTitle}</SeectionTitle>
        <Gap size={8} />

        <FlatList
            ItemSeparatorComponent={() => <Gap size={8} />}
            horizontal={true}
            data={data.contents} renderItem={
                ({ item }) => {
                    return <TouchableHighlight>
                        <PosterItem>
                            <PosterImg source={{ uri: formatter.prefixTmdbImgUrl(item.posterPath, { size: TmdbImageSize.w500 }) }} />

                            <Text style={{ color: colors.white }}>{item.title}</Text>
                        </PosterItem>
                    </TouchableHighlight>
                }
            } />
    </Container>
}

/* VARIABLES */
const posterRatio = 92 / 140;

const Container = styled.View({
    marginTop: 32,
    paddingLeft: 16,
})

const SeectionTitle = styled.Text({
    ...appTextStyle.title2,
    color: colors.white,

})

const PosterImg = styled.Image({
    aspectRatio: posterRatio,
    alignSelf: 'stretch',
    width: 92,
})


const PosterItem = styled.View({

})

export default RecentContentView;