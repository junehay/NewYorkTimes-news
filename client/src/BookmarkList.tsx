import React, { useState, useEffect, useRef } from 'react';
import { Bookmarks, Bookmark } from './modules/bookmark';
import { useDispatch } from 'react-redux';
import { delBookmark } from './modules/bookmark';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';
import Pagination from '@material-ui/lab/Pagination';

const useStyles = makeStyles({
  container: {
    textAlign: 'center'
  },
  bookmark: {
    fontSize: '20px',
    marginRight: '5px',
    verticalAlign: 'middle'
  },
})

type BookmarkProps = {
  bookmarks: Bookmarks;
};

interface List {
  image?: string;
  title?: string;
  link?: string;
  body?: string;
}

const BookmarkList = ({ bookmarks }: BookmarkProps) => {
  const classes = useStyles();

  const [list, setList] = useState<List[]>([]);
  const [page, setPage] = useState(1);
  const searchRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const totalLength: number = bookmarks.length;
  const listLength = 10;
  const totalPage = Math.ceil(totalLength / listLength);
  const offset = (page*listLength)-listLength;

  useEffect(() => {
    const list = [...bookmarks].slice(offset, offset + 10);
    setList(list);
  }, [page, bookmarks]);

  const Search = async (e: React.KeyboardEvent) => {
    const element = e.target as HTMLInputElement;
    const keyword = element.value;
    const filter = bookmarks.filter((v) => {
      return v.title.includes(keyword);
    });
    const list = [...filter].slice(offset, offset + 10);
    setList(list);
  }

  const bookmark = (obj: List): void => {
    const chk: number = chkBookmarkList(bookmarks, obj);
    dispatch(delBookmark(chk));
  };

  const chkBookmarkList = (arr: List[], obj: object): number => {
    let chk: number = -1;
    arr.some((v: List, i: number): boolean | undefined => {
      if (Object.entries(v).toString() === Object.entries(obj).toString()) {
        chk = i;
        return true;
      }
    })
    return chk
  }

  return (
    <Container className={classes.container} maxWidth="sm">
      <h2>Bookmark List ({bookmarks.length})</h2>
      <Link to='/'><Button>article search</Button></Link><br />
      Search : <Input ref={searchRef} onKeyUp={Search}/>
        { list.length > 0 ? list.map((v, i) => {
            return (
              <div key={i} style={{height: '90px', display: 'flex', margin: '10px 0px', textAlign: 'left'}}>
                <a href={v.link} target='_blank' rel='noopener noreferrer' style={{lineHeight: '90px', width: '20%', border: '1px solid #e6e6e6', marginRight: '10px'}}>
                  <img src={v.image} style={{width: '100%', verticalAlign: 'middle', maxHeight: '100%'}}></img>
                </a>
                <div style={{width: '80%'}}>
                  <a href={v.link} target='_blank' rel='noopener noreferrer'><span>{v.title}</span></a>{chkBookmarkList(list, v) > -1 ?
                    <BookmarkIcon className={classes.bookmark} cursor='pointer' onClick={() => bookmark(v)}/>  : <BookmarkBorderIcon className={classes.bookmark} cursor='pointer' onClick={() => bookmark(v)}/> }
                  <p>{v.body}</p>
                </div>
              </div>
            )
          }) : ''
        }
      <div style={{marginTop: '20px'}}>
        <Pagination count={totalPage} variant="outlined" style={{display: 'inline-block'}} onChange={(event, page) => setPage(page)}/>
      </div>
    </Container>
  );
}

export default BookmarkList;