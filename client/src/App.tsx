import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import BookmarkIcon from '@material-ui/icons/Bookmark';
import BookmarkBorderIcon from '@material-ui/icons/BookmarkBorder';

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

interface List {
  image?: string;
  title?: string;
  link?: string;
  body?: string;
}

interface Article {
  multimedia: multimedia[],
  headline: Headline,
  web_url: string,
  lead_paragraph: string
}

interface multimedia {
  url: string
}

interface Headline {
  main: string
}

const App: React.FC = () => {
  const classes = useStyles();

  const [list, setList] = useState<List[]>([]);
  const [page, setPage] = useState(0);
  const [bookmarkList, setBookmarkList] = useState<List[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (page > 0) {
      Search(page)
    }
  }, [page]);

  const Search = async (page?: number) => {
    const aa: any = searchRef.current;
    const keyword: any = aa?.firstChild?.value
    if (page === undefined) {
      setPage(0);
    }
    const api = await axios.get('https://api.nytimes.com/svc/search/v2/articlesearch.json', {
      params: {
        'api-key': process.env.REACT_APP_APIKEY,
        'q': keyword,
        'page': page
      }
    })
    const articles: Article[] = api.data.response.docs;
    const data = articles.map((v: Article) => {
      const image = v.multimedia.length > 0 ? `https://static01.nyt.com/${v.multimedia[0].url}` : '';
      const title = v.headline.main;
      const link = v.web_url;
      const body = v.lead_paragraph.length > 30 ? `${v.lead_paragraph.substr(0,30)} ...more` : v.lead_paragraph;
      return {image, title, link, body};
    })
    setList(data);
  }

  const enterPress = (e?: React.KeyboardEvent<HTMLDivElement>) => {
    return e?.key === 'Enter' ? Search() : false
  };

  const bookmark = (obj: List): void => {
      const chk: number = chkBookmarkList(bookmarkList, obj);
      if (chk > -1) {
        const newBookmarkList = [...bookmarkList];
        newBookmarkList.splice(chk, 1);
        setBookmarkList(newBookmarkList);
      } else {
        setBookmarkList([...bookmarkList, obj])
      }
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
      <h2>New York Times article search</h2>
      <Button>bookmark ({bookmarkList.length})</Button><br />
      <Input ref={searchRef} onKeyPress={enterPress}/>
      <Button onClick={() => Search()}>search</Button>
        { list.length > 0 ? list.map((v, i) => {
            return (
              <div key={i} style={{height: '90px', display: 'flex', margin: '10px 0px', textAlign: 'left'}}>
                <a href={v.link} target='_blank' rel='noopener noreferrer' style={{lineHeight: '90px', width: '20%', border: '1px solid #e6e6e6', marginRight: '10px'}}>
                  <img src={v.image} style={{width: '100%', verticalAlign: 'middle', maxHeight: '100%'}}></img>
                </a>
                <div style={{width: '80%'}}>
                  <a href={v.link} target='_blank' rel='noopener noreferrer'><span>{v.title}</span></a>{chkBookmarkList(bookmarkList, v) > -1 ? <BookmarkIcon className={classes.bookmark} cursor='pointer' onClick={() => bookmark(v)}/>  : <BookmarkBorderIcon className={classes.bookmark} cursor='pointer' onClick={() => bookmark(v)}/> }
                  <p>{v.body}</p>
                </div>
              </div>
            )
          }) : ''
        }
      {page === 0 ? '' : <Button style={{float: 'left'}} onClick={() => page === 1 ? Search() : setPage(page-1)}>＜ Prev</Button>}
      {list.length === 0 ? '' : <Button style={{float: 'right'}} onClick={() => setPage(page+1)}>Next ＞</Button>}
    </Container>
  );
}

export default App;