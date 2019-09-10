import React from 'react';
// import _ from "lodash";
import showdown from "showdown";


class PageScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {content: "" };

  }

  componentWillMount() {
    const converter = new showdown.Converter();
    console.log("loading page", this.props.page);

    let url = `/pages/${this.props.page}.md`;
    const readText = (md)=> {
      const html = converter.makeHtml(md);
      console.log("markdown", html);
      this.setState({
        content: html,
        loading: false
      })
    }

    const loadPage = (r)=> { r.text().then(readText); }

    fetch(url).then(loadPage);

  }

  // scroll down in case the URL is to a #hash anchor
  componentDidUpdate() {
    const hash = window.decodeURIComponent(window.location.hash);
    try {
      if(!hash || !hash.length>0)
        return;
      const id = hash.substr(1);
      const target = document.getElementById(id);
      if(target)
        target.scrollIntoView();
    }
    catch(e) {
      console.log("error finding targer response with id", hash);
      console.log(e);
    }
  }

  render() {
    return (
      <div className="PageContent" dangerouslySetInnerHTML={{__html: this.state.content}} />
    )

  }

}

  export default PageScreen;
