import Gap from '@/shared/components/view/Gap';
import colors from '@/shared/styles/colors';
import appTextStyle from '@/shared/styles/textStyles';
import { BaseContentModel } from '@/shared/types/content/baseContentModel';
import { formatter, TmdbImageSize } from '@/shared/utils/formatter';
import styled from '@emotion/native';
import { FlatList, TouchableHighlight } from 'react-native';

interface SectionContentListViewProps {
  title: string | null;
  contents: BaseContentModel[] | null;
}

function SectionContentListView(props: SectionContentListViewProps) {
  return (
    <Container>
      {props.title != null && <SeectionTitle>{props.title}</SeectionTitle>}

      <Gap size={8} />
      {(props.contents?.length ?? 0) > 0 && (
        <FlatList
          ItemSeparatorComponent={() => <Gap size={8} />}
          horizontal={true}
          data={props.contents}
          renderItem={({ item }) => {
            return (
              <TouchableHighlight>
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
