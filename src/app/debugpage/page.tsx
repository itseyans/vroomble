// app/debugpage/page.tsx
"use client";

import React from 'react';
import styled from "styled-components";
import LoginForm from "../../vcomp/LoginForm.js";

const DebugPage: React.FC = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <LoginForm
                label=""
                placeholder=""
                required={true} // Set required to true or false as needed
                errorMessage=""
            />
        </div>
    );
};

export default DebugPage;