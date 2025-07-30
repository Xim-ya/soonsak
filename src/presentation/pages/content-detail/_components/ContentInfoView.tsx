import React from 'react';
import ContentTypeChip from '@/presentation/components/chip/ContentTypeChip';
import Gap from '@/presentation/components/view/Gap';
import { ContentType } from '@/presentation/types/content/contentType.enum';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import styled from '@emotion/native';
import { StartRateView } from './StartRateView';

const MOCK_DATA = {
  contentType: 'movie' as ContentType,
  title: '인터스텔라',
  contentTitle: '우주선에서 혼자 90년을 살게 된 남자.. (결말포함)',
  releaseYear: 2002,
  genres: ['액션', '드라마', '스릴러'],
};

/**
 * 콘텐츠 기본 정보 표시 컴포넌트
 *
 * 콘텐츠 타입, 제목, 개봉년도, 장르 리스트를 표시합니다.
 */
function ContentInfoView() {
  const { contentType, title, contentTitle, releaseYear, genres } = MOCK_DATA;

  const dotText = ' · ';

  return (
    <Container pointerEvents="box-none">
      <ContentTypeChip contentType={contentType} />
      <Gap size={4} />
      <Title pointerEvents="none">{title}</Title>
      <Gap size={2} />
      <SubTextView pointerEvents="none">
        <SubText>{releaseYear}</SubText>
        <SubText style={{ color: colors.white }}>{dotText}</SubText>
        {genres.map((genre, index) => (
          <React.Fragment key={index}>
            <SubText>{genre}</SubText>
            {index < genres.length - 1 && <SubText>{dotText}</SubText>}
          </React.Fragment>
        ))}
      </SubTextView>
      <Gap size={16} />
      <ContentTitle pointerEvents="none">{contentTitle}</ContentTitle>
      <Gap size={8} />
      <RatingWrapper pointerEvents="none">
        <StartRateView rating={4.5} />
      </RatingWrapper>
    </Container>
  );
}

const Container = styled.View({
  justifyContent: 'center',
  alignItems: 'center',
});

const ContentTitle = styled.Text({
  ...textStyles.body3,
});

const SubTextView = styled.View({
  flexDirection: 'row',
  alignItems: 'center',
});

const Title = styled.Text({
  ...textStyles.headline1,
});

const SubText = styled.Text({
  ...textStyles.alert1,
  color: colors.gray01,
});

const RatingWrapper = styled.View({
  alignItems: 'center',
});

export default ContentInfoView;
