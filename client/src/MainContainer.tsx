import React from 'react';
import Main from './Main';
import { useSelector } from 'react-redux';
import { RootState } from './modules';

const MainContainer = () => {
    const bookmarks = useSelector((state: RootState) => state.bookmarkReducer);
    return <Main bookmarks={bookmarks} />
}

export default MainContainer;