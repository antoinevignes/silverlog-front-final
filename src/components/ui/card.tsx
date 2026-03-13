import styled from "styled-components";

// CARD
export const Card = styled.article`
  background-color: var(--neutral-50);
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.5);
  padding: 1.5rem;
  border-radius: 0.5rem;
`;

// CARD HEADER
export const CardHeader = styled.header`
  padding-bottom: 1rem;
`;

// CARD TITLE ROW
export const CardTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// CARD TITLE
export const CardTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
`;

// CARD RATING
export const CardRating = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-style: italic;
`;

// CARD SUBTITLE
export const CardSubtitle = styled.p`
  margin-top: 0.25rem;
  font-size: 0.875rem;
  color: var(--neutral-600);
`;

// CARD FOOTER
export const CardFooter = styled.footer`
  padding-top: 1rem;
  font-size: 0.875rem;
  color: var(--neutral-600);
`;
