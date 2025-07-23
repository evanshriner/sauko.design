import styled from '@emotion/styled';

export const AppContainer = styled.div<{ isBlooming: boolean }>`
  transition: filter 1s ease-in-out;
  filter: ${({ isBlooming }) =>
    isBlooming ? 'blur(12px) brightness(1.75)' : 'none'};
`;
