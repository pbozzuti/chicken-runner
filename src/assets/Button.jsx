import React from 'react';

function Button({ url, text }) {
    return (
        <button
        onClick={() => window.open(url)}
        style={{
            backgroundColor: '#b969a1',
            padding: '10px 20px',
            margin: '0 auto',
            border: 'none',
            cursor: 'url("/Cooked_Chicken_optimized.png") 16 16, auto',
            borderRadius: '10px',
            color: 'white'
        }}
    >
        {text}
    </button>        
    );
}

export default Button;