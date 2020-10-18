// types
const ADD_BOOKMARK = 'bookmark/ADD_BOOKMARK' as const;
const DEL_BOOKMARK = 'bookmark/DEL_BOOKMARK' as const;

export interface Bookmark {
  image: string;
  title: string;
  link: string;
  body: string;
};

export type Bookmarks = Bookmark[];

type BookmarkAction =
  | ReturnType<typeof addBookmark>
  | ReturnType<typeof delBookmark>;

// actions
export const addBookmark = (data: Bookmark) => ({
  type: ADD_BOOKMARK,
  payload: data
});

export const delBookmark = (index: number) => ({
  type: DEL_BOOKMARK,
  payload: index
});

// initalState
export const initalState: Bookmark[] = [];

// reducer
export default function bookmarkReducer(state: Bookmarks = initalState, action: BookmarkAction): Bookmarks {
  switch (action.type) {
    case ADD_BOOKMARK:
      return [...state, action.payload]
    case DEL_BOOKMARK:
        const newBookmarks = [...state];
        newBookmarks.splice(action.payload, 1);
        return newBookmarks;
    default:
      return state;
  }
};