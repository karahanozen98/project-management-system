import React from 'react';
import styled from 'styled-components';
import loading from '../../assets/images/loading.gif';

const PreLoader = () => {
	return (
		<LoaderWrapper>
			<img src={loading} alt='loader' />
		</LoaderWrapper>
	);
};

export default PreLoader;

const LoaderWrapper = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
`;
