import Gap from '@/presentation/components/view/Gap';
import colors from '@/shared/styles/colors';
import appTextStyle from '@/shared/styles/textStyles';
import { BaseContentModel } from '@/presentation/types/content/baseContentModel';
import { formatter, TmdbImageSize } from '@/shared/utils/formatter';
import styled from '@emotion/native';
import { FlatList, TouchableHighlight } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/shared/navigation/types';
import { routePages } from '@/shared/navigation/constant/routePages';

interface SectionContentListViewProps {
  title: string | null;
  contents: BaseContentModel[] | null;
  onContentTapped: (content: BaseContentModel) => void;
}

/**
 * 제목과 콘텐츠 리스트로 구성된 리스트뷰
 * @param title 섹션 제목 (하드코딩된 값을 전달 받는 경우도 존재)
 * @param contents 콘텐츠 리스트
 */

function SectionContentListView({
  title,
  contents,
  onContentTapped: onItemPress,
}: SectionContentListViewProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleContentPress = (content: BaseContentModel) => {
    if (onItemPress) {
      onItemPress(content);
    } else {
      // 콘텐츠를 클릭했을 때 Player 화면으로 이동
      navigation.navigate(routePages.contentDetail, { id: content.id.toString() });
    }
  };

  return (
    <Container>
      {title != null && <SeectionTitle>{title}</SeectionTitle>}

      <Gap size={8} />
      {(contents?.length ?? 0) > 0 && (
        <FlatList
          ItemSeparatorComponent={() => <Gap size={8} />}
          horizontal={true}
          data={contents}
          renderItem={({ item }) => {
            return (
              <TouchableHighlight onPress={() => handleContentPress(item)}>
                <PosterItem>
                  <PosterImg
                    source={{
                      uri: formatter.prefixTmdbImgUrl(item.posterPath, {
                        size: TmdbImageSize.w500,
                      }),
                    }}
                  />
                  <Gap size={4} />
                  <ContentTitle numberOfLines={1} ellipsizeMode="tail">
                    {item.title}
                  </ContentTitle>
                </PosterItem>
              </TouchableHighlight>
            );
          }}
        />
      )}
    </Container>
  );
}

/* VARIABLES */
const posterRatio = 92 / 140;

const Container = styled.View({
  marginTop: 32,
  paddingLeft: 16,
});

const SeectionTitle = styled.Text({
  ...appTextStyle.title2,
  color: colors.white,
});

const ContentTitle = styled.Text({
  ...appTextStyle.body3,
  color: colors.white,
});

const PosterImg = styled.Image({
  aspectRatio: posterRatio,
  alignSelf: 'stretch',
});

const PosterItem = styled.View({
  width: 92,
});

export { SectionContentListViewProps, SectionContentListView };
