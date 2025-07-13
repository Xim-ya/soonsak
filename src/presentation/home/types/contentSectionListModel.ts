import { ContentType } from "@/shared/types/content/contentType.enum";
import PosterContentModel from "./posterContentModel";
import { BaseContentModel } from "@/shared/types/content/baseContentModel";



/**
 * 홈스크린 > 콘텐츠 섹션 리스트
*/
interface ContentSectionListModel {
    id: string,
    sectionTitle: string,
    contents: BaseContentModel[],
}

const recentContentSectionMokcs = {
    id: 'recentContent',
    sectionTitle: "최근 콘텐츠",
    contents: [
        {
            id: 'our-beloved-summer',
            posterImg: "sXv8mdywUhVgJKyDL16BeiHhtHl.jpg",
            title: "그 해 우리는",
            type: ContentType.series
        },
        {
            id: 'crash-landing-on-you',
            posterImg: "q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
            title: "사랑의 불시착",
            type: ContentType.series
        },
        {
            id: 'hometown-cha-cha-cha',
            posterImg: "1tO4r0OMhP2N3tYZZrMWdFQhGJL.jpg",
            title: "갯마을 차차차",
            type: ContentType.series
        },
        {
            id: 'business-proposal',
            posterImg: "nP4RbfNaVvxKZlnXS1rqgbgKv8z.jpg",
            title: "사내맞선",
            type: ContentType.series
        },
        {
            id: 'twenty-five-twenty-one',
            posterImg: "qZigVn6H4426GPQcZOMTqJOXgK8.jpg",
            title: "스물다섯 스물하나",
            type: ContentType.series
        },
        {
            id: 'descendants-of-the-sun',
            posterImg: "lKkThflmJJEKko2zYqq9NQNgOsz.jpg",
            title: "태양의 후예",
            type: ContentType.series
        },
        {
            id: 'goblin',
            posterImg: "x54deaq4lom5kjGRkjMS5kzNaMa.jpg",
            title: "도깨비",
            type: ContentType.series
        },
        {
            id: 'hotel-del-luna',
            posterImg: "q1ZKX0W8T7k6buMF4kBodZhc6Av.jpg",
            title: "호텔 델루나",
            type: ContentType.series
        },
        {
            id: 'its-okay-to-not-be-okay',
            posterImg: "8Bz8IaJc6LuJOy4jd4bZhvBbZNt.jpg",
            title: "사이코지만 괜찮아",
            type: ContentType.series
        },
        {
            id: 'start-up',
            posterImg: "hZq9AVeUa3z1c6JJVVlg5lWLEPJ.jpg",
            title: "스타트업",
            type: ContentType.series
        },
        {
            id: 'reply-1988',
            posterImg: "lQfdytwN7eh0tXWjIiMceFdBBvD.jpg",
            title: "응답하라 1988",
            type: ContentType.series
        }
    ]
};


const listSectionMocks: ContentSectionListModel[] = [
    {
        id: 'korean-romance-drama',
        sectionTitle: "한국 로맨스 드라마",
        contents: [
            {
                id: 'our-beloved-summer',
                posterPath: "pP3czp8fWKKn7lzeMVBJsjlEhsG.jpg",
                title: "그 해 우리는",
                type: ContentType.series
            },
            {
                id: 'crash-landing-on-you',
                posterPath: "q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
                title: "사랑의 불시착",
                type: ContentType.series
            },
            {
                id: 'hometown-cha-cha-cha',
                posterPath: "1tO4r0OMhP2N3tYZZrMWdFQhGJL.jpg",
                title: "갯마을 차차차",
                type: ContentType.series
            },
            {
                id: 'business-proposal',
                posterPath: "nP4RbfNaVvxKZlnXS1rqgbgKv8z.jpg",
                title: "사내맞선",
                type: ContentType.series
            },
            {
                id: 'twenty-five-twenty-one',
                posterPath: "qZigVn6H4426GPQcZOMTqJOXgK8.jpg",
                title: "스물다섯 스물하나",
                type: ContentType.series
            },
            {
                id: 'descendants-of-the-sun',
                posterPath: "lKkThflmJJEKko2zYqq9NQNgOsz.jpg",
                title: "태양의 후예",
                type: ContentType.series
            },
            {
                id: 'goblin',
                posterPath: "x54deaq4lom5kjGRkjMS5kzNaMa.jpg",
                title: "도깨비",
                type: ContentType.series
            },
            {
                id: 'hotel-del-luna',
                posterPath: "q1ZKX0W8T7k6buMF4kBodZhc6Av.jpg",
                title: "호텔 델루나",
                type: ContentType.series
            },
            {
                id: 'its-okay-to-not-be-okay',
                posterPath: "8Bz8IaJc6LuJOy4jd4bZhvBbZNt.jpg",
                title: "사이코지만 괜찮아",
                type: ContentType.series
            },
            {
                id: 'start-up',
                posterPath: "hZq9AVeUa3z1c6JJVVlg5lWLEPJ.jpg",
                title: "스타트업",
                type: ContentType.series
            },
            {
                id: 'reply-1988',
                posterPath: "lQfdytwN7eh0tXWjIiMceFdBBvD.jpg",
                title: "응답하라 1988",
                type: ContentType.series
            }
        ]
    },
    {
        id: 'korean-thriller-drama',
        sectionTitle: "한국 스릴러 드라마",
        contents: [
            {
                id: 'squid-game',
                posterPath: "dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg",
                title: "오징어 게임",
                type: ContentType.series
            },
            {
                id: 'kingdom',
                posterPath: "q7Z7A6z8UKsbEjHxq8pY0H7ctqD.jpg",
                title: "킹덤",
                type: ContentType.series
            },
            {
                id: 'stranger',
                posterPath: "8TOqxOQ1WNnpRnQccw5HQQqJai4.jpg",
                title: "비밀의 숲",
                type: ContentType.series
            },
            {
                id: 'signal',
                posterPath: "ehgo5hPbzNgWXuXOfHkaBzTLakj.jpg",
                title: "시그널",
                type: ContentType.series
            },
            {
                id: 'vincenzo',
                posterPath: "dvXJgEDQXhL9Ouot2WkBHpQiHGd.jpg",
                title: "빈센조",
                type: ContentType.series
            },
            {
                id: 'mouse',
                posterPath: "3OXiTjU30gWtqxmx4BqW1eFkZuJ.jpg",
                title: "마우스",
                type: ContentType.series
            },
            {
                id: 'extracurricular',
                posterPath: "qGBEmWWO0ObeM18NTLm5L6JH2IR.jpg",
                title: "인간수업",
                type: ContentType.series
            },
            {
                id: 'save-me',
                posterPath: "zQ2yTp7yLVVOYPjLI4D4eoLq2Aw.jpg",
                title: "구해줘",
                type: ContentType.series
            },
            {
                id: 'voice',
                posterPath: "uGqUxtNhiSgK1hUt2lUqKdNb8z3.jpg",
                title: "보이스",
                type: ContentType.series
            },
            {
                id: 'tunnel',
                posterPath: "fFE404ATtaCNhqWKXyxcHKWlqZN.jpg",
                title: "터널",
                type: ContentType.series
            }
        ]
    },
    {
        id: 'korean-movies',
        sectionTitle: "한국 영화",
        contents: [
            {
                id: 'parasite',
                posterPath: "7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
                title: "기생충",
                type: ContentType.movie
            },
            {
                id: 'minari',
                posterPath: "decLzyHOcnH3DjqzIHdTYaKeOvW.jpg",
                title: "미나리",
                type: ContentType.movie
            },
            {
                id: 'burning',
                posterPath: "wP1DwN3rewTnvqy3CgxuJFqzJKq.jpg",
                title: "버닝",
                type: ContentType.movie
            },
            {
                id: 'oldboy',
                posterPath: "pWDtjs568ZfOTMbURQBYuT4Qcrn.jpg",
                title: "올드보이",
                type: ContentType.movie
            },
            {
                id: 'train-to-busan',
                posterPath: "wdKOor1L7BKDBjsGcpFl4gZHqH5.jpg",
                title: "부산행",
                type: ContentType.movie
            },
            {
                id: 'the-handmaiden',
                posterPath: "dTsgvjHETAoTVpOXiZn6Homq1mO.jpg",
                title: "아가씨",
                type: ContentType.movie
            },
            {
                id: 'decision-to-leave',
                posterPath: "tP9J9zBjsEiq1aDkOPPCNUWjHs7.jpg",
                title: "헤어질 결심",
                type: ContentType.movie
            },
            {
                id: 'the-wailing',
                posterPath: "mzUpbJyLnVLEVgWpa9kJv5A3nnl.jpg",
                title: "곡성",
                type: ContentType.movie
            },
            {
                id: 'memories-of-murder',
                posterPath: "7dfP8kbEGZLmQVBdwNax0vKLKFc.jpg",
                title: "살인의 추억",
                type: ContentType.movie
            },
            {
                id: 'the-man-from-nowhere',
                posterPath: "dPSqzulZqxIL3LKQTLW5ovnkuv6.jpg",
                title: "아저씨",
                type: ContentType.movie
            },
            {
                id: 'extreme-job',
                posterPath: "fK9OZrEl3l3WMv5KoUI2mHFBDJI.jpg",
                title: "극한직업",
                type: ContentType.movie
            }
        ]
    }
];

export { ContentSectionListModel, recentContentSectionMokcs, listSectionMocks }

