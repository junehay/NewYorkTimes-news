import React from 'react';
import { Bookmarks, Bookmark } from '../modules/bookmark';
import { useDispatch } from 'react-redux';
import { addBookmark, delBookmark } from '../modules/bookmark';
import { makeStyles } from '@material-ui/core/styles'
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import styled from 'styled-components';

const useStyles = makeStyles({
  bookmark: {
    fontSize: '20px',
    marginRight: '5px',
    verticalAlign: 'middle'
  },
})

interface ArticelProps {
  bookmarks: Bookmarks;
  item: Bookmark;
};

const Article = ({ bookmarks, item }: ArticelProps) => {
  const classes = useStyles();

  const dispatch = useDispatch();

  const bookmark = (obj: Bookmark): void => {
    const chk: number = chkBookmarks(bookmarks, obj);
    if (chk > -1) {
      dispatch(delBookmark(chk));
    } else {
      dispatch(addBookmark(obj));
    }
  };

  const chkBookmarks = (arr: Bookmark[], obj: object): number => {
    let chk: number = -1;
    arr.some((v: Bookmark, i: number): boolean | number => {
      return Object.entries(v).toString() === Object.entries(obj).toString() ? chk = i : false;
    });
    return chk;
  }

  return (
    <ArticleBox>
      <ImageBox href={item.link} target='_blank' rel='noopener noreferrer'>
        <Image src={item.image}></Image>
      </ImageBox>
      <ContentsBox>
        <a href={item.link} target='_blank' rel='noopener noreferrer'><Title>{item.title}</Title></a>
          {chkBookmarks(bookmarks, item) > -1 ? <BookmarkIcon className={classes.bookmark} cursor='pointer' onClick={() => bookmark(item)}/>  :
          <BookmarkBorderIcon className={classes.bookmark} cursor='pointer' onClick={() => bookmark(item)}/> }
        <Body>{item.body}</Body>
      </ContentsBox>
    </ArticleBox>
  )
}

const ArticleBox = styled.div`
  @media only screen and (max-width: 768px) {
    height: 70px;
  }
  @media only screen and (min-width: 768px) {
    height: 80px;
  }
  @media only screen and (min-width: 1200px) {
    height: 90px;
  }
  display: flex;
  margin: 10px 0px;
  text-align: left;
`;

const ImageBox = styled.a`
  line-height: 90px;
  width: 20%;
  border: 1px solid #e6e6e6;
  margin-right: 10px;
`;

const Image = styled.img`
  width: 100%;
  vertical-align: middle;
  max-height: 100%;
`;

const ContentsBox = styled.div`
  width: 80%;
`;

const Title = styled.span`
  @media only screen and (max-width: 768px) {
    font-size: 13px;
  }
  @media only screen and (min-width: 768px) {
    font-size: 14px;
  }
  @media only screen and (min-width: 1200px) {
    font-size: 15px;
  }
`;

const Body = styled.p`
  @media only screen and (max-width: 768px) {
    font-size: 12px;
  }
  @media only screen and (min-width: 768px) {
    font-size: 13px;
  }
  @media only screen and (min-width: 1200px) {
    font-size: 14px;
  }
`;

export default Article;