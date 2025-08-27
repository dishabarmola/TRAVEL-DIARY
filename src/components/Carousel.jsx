import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay} from "swiper/modules";
import img1  from '../assets/img1.jpg';
import img2 from '../assets/img2.png';
import img3 from '../assets/img3.jpg';
import "swiper/css";

const Carousel = () => {
  return (
    <div className="w-full">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={true}
        modules={[Autoplay]}
      >
        <SwiperSlide>
          <img
            src={img1}
            alt="Slide 1"
            className="w-full h-115"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={img2}
            alt="Slide 2"
            className="w-full h-115"
          />
        </SwiperSlide>
        <SwiperSlide>
          <img
            src={img3}
            alt="Slide 3"
            className="w-full h-115"
          />
        </SwiperSlide>
      </Swiper>
    </div>
  );
}

export default Carousel
