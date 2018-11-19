import React, { Component } from "react";
import styles from './Home.css';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption
} from 'reactstrap';

const items = [
  {
    src: './beer1.gif',
    caption: 'Ice Cold'
  },
  {
    src: './beer2.gif',
    caption: 'Just The Right Balance of Hops and Malt'
  },
  {
    src: './beer3.gif',
    caption: 'More Than 50 Draft Beers!'
  }
];

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIndex: 0,
    };

    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.goToIndex = this.goToIndex.bind(this);
    this.onExiting = this.onExiting.bind(this);
    this.onExited = this.onExited.bind(this);
  }

  onExiting() {
    this.animating = true;
  }

  onExited() {
    this.animating = false;
  }

  next() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === items.length - 1 ? 0 : this.state.activeIndex + 1;
    this.setState({ activeIndex: nextIndex });
  }

  previous() {
    if (this.animating) return;
    const nextIndex = this.state.activeIndex === 0 ? items.length - 1 : this.state.activeIndex - 1;
    this.setState({ activeIndex: nextIndex });
  }

  goToIndex(newIndex) {
    if (this.animating) return;
    this.setState({ activeIndex: newIndex });
  }


  render() {
    const { activeIndex } = this.state;

     const slides = items.map((item) => {
                    return (
                      <CarouselItem
                      className="item"
                      style={styles.item}
                      onExiting={this.onExiting}
                      onExited={this.onExited}
                      key={item.src}
                      >
                      <img style={{ height: '600px', width: '100%' }} src={item.src} alt={item.altText} />
                      <CarouselCaption className="caption" captionText='' captionHeader={item.caption} />
                      </CarouselItem>
                    );
                  });

    const footer =  <div align="center">
                      <div className="row" style={{ height:'250px'}}>

                      <div className="column" style={{marginLeft: '10%', width: '25%'}}>
                          <h2 className="titleCurs" align="left">Follow Us!</h2>
                      <div className="row" style={{ display:'table', width: '25%', height: '25%'}}>
                          <a href="https://www.facebook.com">
                          <div className="facebook" />
                          </a>
                          <a href="https://www.instagram.com">
                          <div className="instagram" />
                          </a>
                    </div>
                    </div>

                    <div className="column" style={{width: '60%', marginRight: '0'}}>
                    <br/>
                    <div className="row" style={{ width: '85%', height: '10%'}}>
                      <h2 className="titleCurs" style={{ width: '33.3%'}}>About</h2>
                      <h2 className="titleCurs" style={{ width: '33.3%'}}>Quality</h2>
                      <h2 className="titleCurs" style={{ width: '33.3%'}}>Orders</h2>
                  </div>
                  <br/>
                  <div className="row" style={{ width: '85%', height: '50%'}}>
                    <p className="bodyCurs" style={{ width: '33%'}}>
                    The premier data aggregator of the Top 100 Bars across the 6 major cities in America!
                    </p>
                    <p className="bodyCurs" style={{ width: '33%'}}>
                    We vow to only sell the highest quality beers providing a perfect balance of hops and malt.
                    </p>
                    <p className="bodyCurs" style={{ width: '33%'}}>
                    Please contact us for orders by phone Monday through Saturday.<br/>908-457-8867
                    </p>
                </div>
                  </div>


                    </div>
                    <div className="row" style={{ display:'table', width: '25%', height: '25%'}}>
                        <p style={{ font:  "22px Helvetica", color: "black", textAlign: 'center' }}>© 2018 Beerazon</p>
                    </div>
                    </div>


     return (
       <div style={{ backgroundColor: "white", height: "100%" }}>
       <Carousel
        className="carousel"
        styles={styles.carousel}
         activeIndex={activeIndex}
         next={this.next}
         previous={this.previous}
       >
         <CarouselIndicators items={items} activeIndex={activeIndex} onClickHandler={this.goToIndex} />
         {slides}
         <CarouselControl direction="prev" directionText="Previous" onClickHandler={this.previous} />
         <CarouselControl direction="next" directionText="Next" onClickHandler={this.next} />
       </Carousel>
       <hr aign="center" style={{ color: "lightGray", backgroundColor: "lightGray", width: "90%"}}/>
       {
         footer
       }
       </div>
     );
   }
}

export default Home;
