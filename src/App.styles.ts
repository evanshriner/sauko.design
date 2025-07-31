import styled from '@emotion/styled';

export const AppContainer = styled.div<{ isTransitioning: boolean }>`
  pointer-events: none;
  transition: filter 1s ease-out;
  filter: ${({ isTransitioning }) =>
    isTransitioning ? 'blur(6px) brightness(1.15)' : 'none'};
`;
