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
    UPDATED_AT: 'updated_at',
  },
  // QUERIES: {
  //     SELECT_ALL: '*',
  //     SELECT_BASIC: 'id, title, content_type, poster_path',
  // }
} as const;
