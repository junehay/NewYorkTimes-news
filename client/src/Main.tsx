import React, { useState, useEffect, useRef } from 'react';
import { Bookmarks } from './modules/bookmark';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
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

interface List {
  image: string;
  title: string;
  link: string;
  body: string;
}

interface ArticleSearch {
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

const Main = ({ bookmarks }: BookmarkProps) => {
  const classes = useStyles();

  const [list, setList] = useState<List[]>([]);
  const [page, setPage] = useState(0);
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
    const ArticleSearchData: ArticleSearch[] = api.data.response.docs;
    const data = ArticleSearchData.map((v: ArticleSearch) => {
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

  return (
    <Container className={classes.container} maxWidth="sm">
      <h2>New York Times Article Search</h2>
      <Link to='/bookmark'><Button>bookmark ({bookmarks.length})</Button></Link><br />
      <Input ref={searchRef} onKeyPress={enterPress} style={{margin: '10px 0px'}}/>
      <Button onClick={() => Search()}>search</Button>
        { list.length > 0 ? list.map((v, i) => {
            return (
              <Article key={i} bookmarks={bookmarks} item={v} />
            )
          }) : ''
        }
      {page === 0 ? '' : <Button style={{float: 'left'}} onClick={() => page === 1 ? Search() : setPage(page-1)}>＜ Prev</Button>}
      {list.length === 0 ? '' : <Button style={{float: 'right'}} onClick={() => setPage(page+1)}>Next ＞</Button>}
    </Container>
  );
}

export default Main;