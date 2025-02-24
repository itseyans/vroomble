import React from 'react';
import styled from 'styled-components';

const Button = styled.button`
    font-size: 20px;
    color: #131415;
    width: 155px;
    height: 35px;
    border: 2px solid #131415;
    border-radius: 12px;
    transition: background-color 0.3s;
    background-color: white;

    &:hover {
    background-color: #FFC629;
    cursor: pointer;
    }

    &:disabled {
    background-color: #CCCCCC;
    cursor: default;
    }
`;

export default Button;
