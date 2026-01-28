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
  },
} as const;
