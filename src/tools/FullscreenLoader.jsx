import React from 'react';
import { Box, CircularProgress } from "@mui/material";

const FullscreenLoader = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1300 // Ensures it overlays other content
            }}
        >
            <CircularProgress color="inherit" size={150} />
        </Box>
    );
};

export default FullscreenLoader;
