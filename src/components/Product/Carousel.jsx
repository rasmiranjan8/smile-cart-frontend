import { useShowProduct } from "hooks/reactQuery/useProductsApi";
import { useParams } from "react-router-dom";
import { append } from "ramda";

import { useEffect, useState, useRef } from "react";

import { Left, Right } from "neetoicons";
import { Button } from "neetoui";

const Carousel = () => {
  const {slug}=useParams();
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);
  const { data: { imageUrl, imageUrls: partialImageUrls, title } = {} } =
    useShowProduct(slug);
  const imageUrls = append(imageUrl, partialImageUrls);

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % imageUrls.length;
    setCurrentIndex(nextIndex);
  };

  const handlePrevious = () => {
    const previousIndex =
      (currentIndex - 1 + imageUrls.length) % imageUrls.length;
    setCurrentIndex(previousIndex);
  };

  const resetTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % imageUrls.length);
    }, 3000);
  };

  useEffect(() => {
    resetTimer();

    return () => clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    // Reset timer whenever currentIndex changes (user interaction)
    resetTimer();
  }, [currentIndex]);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center">
        <Button
          className="shrink-0 focus-within:ring-0 hover:bg-transparent"
          icon={Left}
          style="text"
          onClick={() => {
            handlePrevious();
          }}
        />
        <img
          alt={title}
          className="max-w-56 h-56 max-h-56 w-56"
          src={imageUrls[currentIndex]}
        />
        <Button
          className="shrink-0 focus-within:ring-0 hover:bg-transparent"
          icon={Right}
          style="text"
          onClick={() => {
            handleNext();
          }}
        />
      </div>
      <div className="flex space-x-1">
        {imageUrls.map((_, index) => (
          <span
            key={index}
            className={`neeto-ui-rounded-full h-3 w-3 cursor-pointer border ${
              index === currentIndex ? "bg-black" : "neeto-ui-border-black"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
