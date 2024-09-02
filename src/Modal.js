import React, { useState } from 'react';
import { Modal, Fade, Typography, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';

const useStyles = () => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'black',
  },
  modalContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    borderRadius: '8px',
    maxWidth: '80%',
    maxHeight: '80%',
    overflow: 'auto',
    outline: 'none',
    textAlign: 'center',
    fontFamily: 'Arial, sans-serif',
    position: 'relative', // Position relative for absolute positioning of arrows
  },
  closeBtn: {
    position: 'absolute',
    top: '8px',
    right: '8px',
  },
  arrowBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1, // Ensure arrows are above other content
  },
});

function CustomModal({ data, selectedIndex, onClose }) {
  const classes = useStyles();
  const [currentIndex, setCurrentIndex] = useState(selectedIndex);

  const handlePrevClick = () => {
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : data.length - 1;
    setCurrentIndex(prevIndex);
  };

  const handleNextClick = () => {
    const nextIndex = currentIndex < data.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(nextIndex);
  };

  return (
    <Modal
      open={Boolean(selectedIndex !== null)}
      onClose={onClose}
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      closeAfterTransition
      className={classes.modal}
      style={{
        background: '#ffffff',
        display: 'block', // Make the image a block element
        margin: '0 auto', // Center align horizontally
      }}
    >
      <Fade in={Boolean(selectedIndex !== null)}>
        <Box className={classes.modalContent}>
          <IconButton className={classes.closeBtn} onClick={onClose}>
            <CloseIcon />
          </IconButton>
          <IconButton className={classes.arrowBtn} style={{ left: '8px' }} onClick={handlePrevClick}>
            <KeyboardArrowLeftIcon />
          </IconButton>
          <IconButton className={classes.arrowBtn} style={{ right: '8px' }} onClick={handleNextClick}>
            <KeyboardArrowRightIcon />
          </IconButton>
          <Typography variant="h4" gutterBottom style={{
            textAlign: 'center'
          }}>
            {data[currentIndex]?.name}
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            {data[currentIndex]?.bio}
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            URL: <a href={data[currentIndex]?.url} target="_blank" rel="noopener noreferrer">{data[currentIndex]?.url}</a>
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Profile ID: {data[currentIndex]?.id}
          </Typography>
          <Typography variant="body1" align="center" gutterBottom>
            Last Screenshot: {data[currentIndex]?.lastScreenshot}
          </Typography>
          <Box>
            <img
              src={data[currentIndex]?.screenshotURL} // Update the src attribute with the AWS S3 image URL
              alt="S3 Image"
              style={{
                display: 'block', // Make the image a block element
                margin: '0 auto', // Center align horizontally
                maxWidth: '50%',
                maxHeight: '400px',
              }}
            />
          </Box>
        </Box>
      </Fade>
    </Modal >
  );
}

export default CustomModal;
