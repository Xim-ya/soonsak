import { ContentType, contentTypeConfigs } from '@/presentation/types/content/contentType.enum';
import colors from '@/shared/styles/colors';
import textStyles from '@/shared/styles/textStyles';
import styled from '@emotion/native';

function ContentTypeChip({ contentType }: { contentType: ContentType }) {
  return (
    <ChipContainer>
      <ChipText>{contentTypeConfigs[contentType].label}</ChipText>
    </ChipContainer>
  );
}

const ChipContainer = styled.View({
  backgroundColor: colors.white,
  paddingHorizontal: 5,
  paddingVertical: 2,
  borderRadius: 4,
});

const ChipText = styled.Text({
  ...textStyles.nav,
  color: colors.black,
});

export default ContentTypeChip;
