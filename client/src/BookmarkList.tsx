import React, { useState, useEffect, useRef } from 'react';
import { Bookmarks } from './modules/bookmark';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Pagination from '@material-ui/lab/Pagination';
import Article from './components/Article';

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

const BookmarkList = ({ bookmarks }: BookmarkProps) => {
  const classes = useStyles();

  const [list, setList] = useState<Bookmarks>([]);
  const [page, setPage] = useState(1);
  const searchRef = useRef<HTMLDivElement>(null);

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

  return (
    <Container className={classes.container} maxWidth="sm">
      <h2>Bookmark List ({bookmarks.length})</h2>
      <Link to='/'><Button>article search</Button></Link><br />
      Search : <Input ref={searchRef} onKeyUp={Search} style={{margin: '10px 0px'}}/>
        { list.length > 0 ? list.map((v, i) => {
            return (
              <Article key={i} bookmarks={bookmarks} item={v} />
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