import React from 'react';


interface BannerProps {
  message: string;
  type: string;
  onClose: () => void;
}

const Banner = ({ message, type, onClose } : BannerProps) => {
  let bannerClass = 'banner';
  if (type === 'error') bannerClass += ' error';
  else if (type === 'success') bannerClass += ' success';
  // Add more types as needed

  return (
    <div className={bannerClass}style={{
      borderRadius: '20px',
    }}>
      <p>{message}</p>
      <button onClick={onClose}>X</button>
    </div>
  );
};

export default Banner;