import { ContentType } from '@/shared/types/content/contentType.enum';
import { BaseContentModel } from '../../../shared/types/content/baseContentModel';

interface TopContentModel extends BaseContentModel {
  pointDescription: string;
  keywords: string[];
  backdropImgUrl: string;
}

const topContentMock: TopContentModel[] = [
  {
    pointDescription: '미친듯한 미장센의 향연',
    keywords: ['코미디', '드라마', '스릴러'],
    backdropImgUrl: '8eihUxjQsJ7WvGySkVMC0EwbPAD.jpg',
    id: '496243',
    title: '기생충',
    type: ContentType.movie,
  },
  {
    pointDescription: '질문을 던지는 드라마',
    keywords: ['드라마', '미스터리', '판타지'],
    backdropImgUrl: 'dsMQSCOC9ReOUx0w6E1GMBMeLKS.jpg',
    id: '95396',
    title: '세브란스 단절',
    type: ContentType.series,
  },
];

export { TopContentModel, topContentMock };
