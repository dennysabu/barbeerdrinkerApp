import React, { Component } from "react";
import styles from './Home.css';
import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  CarouselCaption,
  Badge
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

     return (
       <div style={{ backgroundColor: "#333a40", height: "100%" }}>
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
       <hr style={{ color: "lightGray", backgroundColor: "lightGray" }}/>
       <br/>
       <br/>
       <h2 className="follow">Follow Us!</h2>
       <div>
       <div className="facebook"/>
       <div className="instagram"/>
       </div>
       <br/>
       <br/>
       <br/>
       <br/>
       <br/>
       <br/>
       <p style={{ font:  "22px cursive, courier", color: "white", textAlign: "center" }}>© 2018 Beerazon</p>
       </div>
     );
   }
}

export default Home;
