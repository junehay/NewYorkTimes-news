import React from 'react';
import BookmarkList from './BookmarkList';
import { useSelector } from 'react-redux';
import { RootState } from './modules';

const BookmarksContainer = () => {
    const bookmarks = useSelector((state: RootState) => state.bookmarkReducer);
    return <BookmarkList bookmarks={bookmarks} />
}

export default BookmarksContainer;