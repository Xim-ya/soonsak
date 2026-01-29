export const CONTENT_DATABASE = {
  TABLES: {
    CONTENTS: 'contents',
  },
  COLUMNS: {
    ID: 'id',
    TITLE: 'title',
    CONTENT_TYPE: 'content_type',
    POSTER_PATH: 'poster_path',
    UPLOADED_AT: 'uploaded_at',
  },
  RPC: {
    INCREMENT_VIEW_COUNT: 'increment_content_view_count',
    INCREMENT_PLAY_COUNT: 'increment_content_play_count',
    GET_REGISTERED_CONTENTS_WITH_ENDING: 'get_registered_contents_with_ending',
    GET_TOP_CONTENTS_BY_SCORE: 'get_top_contents_by_score',
    SEARCH_CONTENTS_KOREAN: 'search_contents_korean',
    GET_DISTINCT_CONTENTS_BY_CHANNEL: 'get_distinct_contents_by_channel',
    GET_CONTENTS_BY_GENRE: 'get_contents_by_genre',
  },
} as const;
